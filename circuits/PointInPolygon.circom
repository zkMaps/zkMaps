pragma circom 2.0.0;

include "Utility.circom";
include "Lines.circom";

/*
Returns 1 if a given point is in an n sided polygon, 0 otherwise.
Implements ray tracing algorithm for simple polygons on a discrete 2^grid_bits length plane.
Note, we don't check that the polygon is simple here, that must be done separately.
*/
template RayTracing(n, grid_bits) {
    signal input point[2];
    signal input polygon[n][2];
    signal output out;

    // Check that (2^grid_bits)^2 < p to prevent overflow
    // assert((2**grid_bits)**2 < p);

    // Make sure every vertex in the polygon is in the range [0, 2^grid_bits)
    // Disallow vertices on the y-axis
    component x_comp[n];
    component y_comp[n];
    component x_zero[n];
    for (var i=0; i<n; i++) {
        // TODO: optimise
        // We can possibly get rid of IsZero and just use a different CompComstant expression
        // We might be able to get rid of the comps and just use assert, as asserts already fail in num2bits - will this make us vulnerable to a malicious prover?
        x_comp[i] = Comp(2**grid_bits-1);
        x_comp[i].in <== polygon[i][0];
        x_comp[i].out === 0;

        x_zero[i] = IsZero();
        x_zero[i].in <== polygon[i][0];
        x_zero[i].out === 0;

        y_comp[i] = Comp(2**grid_bits-1);
        y_comp[i].in <== polygon[i][1];
        y_comp[i].out === 0;
    }

    // Make sure the point is in the range (0, 2^grid_bits)
    component comp[2];
    for (var i=0; i<2; i++) {
        comp[i] = Comp(2**grid_bits-1);
        comp[i].in <== point[i];
        comp[i].out === 0;
    }

    // We consider all points that share a y coordinate with a vertex to be outside the polygon
    // This avoids edge cases where the ray intersects the polygon at a corner, which can either count as 1 or 2 crossings
    // Note that this means our polygon is discontinuous and slightly counterintuitive
    component mult = MultiplierN(n);
    for (var i=0; i<n; i++) {
        mult.in[i] <== polygon[i][1] - point[1];
    }
    // Normalise to 0 or 1
    component isZero = IsZero();
    isZero.in <== mult.out;
    signal not_on_vertex_line <== (isZero.out-1)*(-1);

    // Count the number of intersections with the ray
    // For each edge, determine whether the ray intersects the edge
    // Return whether the number of intersections is even, meaning the point is outside the polygon
    component intersections[n];
    var intersection_sum = 0;
    for (var i=0; i<n; i++) {
        intersections[i] = Intersects(grid_bits);
        // line1 is the ray, from (0,y) to (x,y)
        intersections[i].line1[0][0] <== 0;
        intersections[i].line1[0][1] <== point[1];
        intersections[i].line1[1][0] <== point[0];
        intersections[i].line1[1][1] <== point[1];

        // line2 is the edge from polygon[n] to polygon[(n+1)%n]
        intersections[i].line2[0][0] <== polygon[i][0];
        intersections[i].line2[0][1] <== polygon[i][1];
        intersections[i].line2[1][0] <== polygon[(i+1)%n][0];
        intersections[i].line2[1][1] <== polygon[(i+1)%n][1];

        // make sure the value is 0 or 1
        intersections[i].out * (intersections[i].out - 1) === 0;
        intersection_sum += intersections[i].out;
    }

    signal intersection_count <== intersection_sum;
    component num2Bits = Num2Bits(n+1); // n+1 bits is easily sufficient to hold a value up to n, TODO: reduce to actual minimum
    num2Bits.in <== intersection_count;
    signal odd_intersections <== num2Bits.out[0];
    out <== odd_intersections * not_on_vertex_line;
}

/*
Returns 1 if a polygon is simple and non-degenerate, 0 otherwise.
Brute force algorithm. TODO: optimise
*/
template SimplePolygon(n, grid_bits) {
    signal input polygon[n][2];
    signal output out;

    // Make sure none of the lines intersect, except two adjacent lines, where we just require that p3 can't be on the segment p1p2

    // Make sure no two lines intersect, except if they're adjacent, since two adjacent lines share a point and necessarily intersect
    var c = (n-2)*(n-1)/2 - 1;  // triangle number for n-2 minus 1
    /*
    To show which intersections should be calculated let's make a table of the n*n possible intersections and exclude those which are invalid or unnecessary

        1   2   3   4   5 
    1   e   +   y   y   - 
    2   -   e   +   y   y
    3   r   -   e   +   y
    4   r   r   -   e   + 
    5   +   r   r   -   e 

    y means we calculate it
    e means we don't calcualte it becuase the lines are equal
    + means we don't calculate it because line 1 is one greater than line 2
    - means we don't calculate it because line 1 is one less than line 2
    r means we don't calculate it because it would be repeated work

    Visually, the ys are the top right triangle minus 1, giving (n-2)*(n-1)/2 - 1
    */
    component intersects[c];
    component hasNoIntersection = MultiplierN(c);
    signal notIntersects[c];
    var index = 0;
    for (var i=0; i<n; i++) {
        for (var j=0; j<n; j++) {
            if (j != i && // we don't compare a line to itself
                (j+1)%n != i && // we don't compare a line to the one before it, since they share a point
                (i+1)%n != j && // we don't compare a line to the one after it, since they share a point
                i < j // we don't need to calculate the same intersection twice
            ) {
                intersects[index] = Intersects(grid_bits);
                intersects[index].line1[0][0] <== polygon[i][0];
                intersects[index].line1[0][1] <== polygon[i][1];
                intersects[index].line1[1][0] <== polygon[(i+1)%n][0];
                intersects[index].line1[1][1] <== polygon[(i+1)%n][1];

                intersects[index].line2[0][0] <== polygon[j][0];
                intersects[index].line2[0][1] <== polygon[j][1];
                intersects[index].line2[1][0] <== polygon[(j+1)%n][0];
                intersects[index].line2[1][1] <== polygon[(j+1)%n][1];

                notIntersects[index] <== (intersects[index].out - 1) * (-1);
                hasNoIntersection.in[index] <== notIntersects[index];
                index++;
            }
        }
    }

    // Make sure vertices adjacent to each line is not on the line
    component onSegment[n*2];
    signal notOnSegment[n*2];
    component notOnAnySegment = MultiplierN(n*2);
    for (var i=0; i<n; i++) { // for every line
        // make sure the next vertex (with wraparound) is not on the current segment
        onSegment[2*i] = OnSegment(grid_bits);
        onSegment[2*i].line[0][0] <== polygon[i][0];
        onSegment[2*i].line[0][1] <== polygon[i][1];
        onSegment[2*i].line[1][0] <== polygon[(i+1)%n][0];
        onSegment[2*i].line[1][1] <== polygon[(i+1)%n][1];
        onSegment[2*i].point[0] <== polygon[(i+2)%n][0];
        onSegment[2*i].point[1] <== polygon[(i+2)%n][1];

        notOnSegment[2*i] <== (onSegment[2*i].out - 1) * (-1);
        notOnAnySegment.in[2*i] <== notOnSegment[2*i];

        // make sure the current vertex is not on the next line
        onSegment[2*i+1] = OnSegment(grid_bits);
        onSegment[2*i+1].line[0][0] <== polygon[(i+1)%n][0];
        onSegment[2*i+1].line[0][1] <== polygon[(i+1)%n][1];
        onSegment[2*i+1].line[1][0] <== polygon[(i+2)%n][0];
        onSegment[2*i+1].line[1][1] <== polygon[(i+2)%n][1];
        onSegment[2*i+1].point[0] <== polygon[i][0];
        onSegment[2*i+1].point[1] <== polygon[i][1];

        notOnSegment[2*i+1] <== (onSegment[2*i+1].out - 1) * (-1);
        notOnAnySegment.in[2*i+1] <== notOnSegment[2*i+1];
    }
    out <== notOnAnySegment.out * hasNoIntersection.out;
}