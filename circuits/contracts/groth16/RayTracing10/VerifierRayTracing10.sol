//
// Copyright 2017 Christian Reitwiessner
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// 2019 OKIMS
//      ported to solidity 0.6
//      fixed linter warnings
//      added requiere error messages
//
//
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.6.11;
library Pairing {
    struct G1Point {
        uint X;
        uint Y;
    }
    // Encoding of field elements is: X[0] * z + X[1]
    struct G2Point {
        uint[2] X;
        uint[2] Y;
    }
    /// @return the generator of G1
    function P1() internal pure returns (G1Point memory) {
        return G1Point(1, 2);
    }
    /// @return the generator of G2
    function P2() internal pure returns (G2Point memory) {
        // Original code point
        return G2Point(
            [11559732032986387107991004021392285783925812861821192530917403151452391805634,
             10857046999023057135944570762232829481370756359578518086990519993285655852781],
            [4082367875863433681332203403145435568316851327593401208105741076214120093531,
             8495653923123431417604973247489272438418190587263600148770280649306958101930]
        );

/*
        // Changed by Jordi point
        return G2Point(
            [10857046999023057135944570762232829481370756359578518086990519993285655852781,
             11559732032986387107991004021392285783925812861821192530917403151452391805634],
            [8495653923123431417604973247489272438418190587263600148770280649306958101930,
             4082367875863433681332203403145435568316851327593401208105741076214120093531]
        );
*/
    }
    /// @return r the negation of p, i.e. p.addition(p.negate()) should be zero.
    function negate(G1Point memory p) internal pure returns (G1Point memory r) {
        // The prime q in the base field F_q for G1
        uint q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;
        if (p.X == 0 && p.Y == 0)
            return G1Point(0, 0);
        return G1Point(p.X, q - (p.Y % q));
    }
    /// @return r the sum of two points of G1
    function addition(G1Point memory p1, G1Point memory p2) internal view returns (G1Point memory r) {
        uint[4] memory input;
        input[0] = p1.X;
        input[1] = p1.Y;
        input[2] = p2.X;
        input[3] = p2.Y;
        bool success;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := staticcall(sub(gas(), 2000), 6, input, 0xc0, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require(success,"pairing-add-failed");
    }
    /// @return r the product of a point on G1 and a scalar, i.e.
    /// p == p.scalar_mul(1) and p.addition(p) == p.scalar_mul(2) for all points p.
    function scalar_mul(G1Point memory p, uint s) internal view returns (G1Point memory r) {
        uint[3] memory input;
        input[0] = p.X;
        input[1] = p.Y;
        input[2] = s;
        bool success;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := staticcall(sub(gas(), 2000), 7, input, 0x80, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require (success,"pairing-mul-failed");
    }
    /// @return the result of computing the pairing check
    /// e(p1[0], p2[0]) *  .... * e(p1[n], p2[n]) == 1
    /// For example pairing([P1(), P1().negate()], [P2(), P2()]) should
    /// return true.
    function pairing(G1Point[] memory p1, G2Point[] memory p2) internal view returns (bool) {
        require(p1.length == p2.length,"pairing-lengths-failed");
        uint elements = p1.length;
        uint inputSize = elements * 6;
        uint[] memory input = new uint[](inputSize);
        for (uint i = 0; i < elements; i++)
        {
            input[i * 6 + 0] = p1[i].X;
            input[i * 6 + 1] = p1[i].Y;
            input[i * 6 + 2] = p2[i].X[0];
            input[i * 6 + 3] = p2[i].X[1];
            input[i * 6 + 4] = p2[i].Y[0];
            input[i * 6 + 5] = p2[i].Y[1];
        }
        uint[1] memory out;
        bool success;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := staticcall(sub(gas(), 2000), 8, add(input, 0x20), mul(inputSize, 0x20), out, 0x20)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require(success,"pairing-opcode-failed");
        return out[0] != 0;
    }
    /// Convenience method for a pairing check for two pairs.
    function pairingProd2(G1Point memory a1, G2Point memory a2, G1Point memory b1, G2Point memory b2) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](2);
        G2Point[] memory p2 = new G2Point[](2);
        p1[0] = a1;
        p1[1] = b1;
        p2[0] = a2;
        p2[1] = b2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for three pairs.
    function pairingProd3(
            G1Point memory a1, G2Point memory a2,
            G1Point memory b1, G2Point memory b2,
            G1Point memory c1, G2Point memory c2
    ) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](3);
        G2Point[] memory p2 = new G2Point[](3);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for four pairs.
    function pairingProd4(
            G1Point memory a1, G2Point memory a2,
            G1Point memory b1, G2Point memory b2,
            G1Point memory c1, G2Point memory c2,
            G1Point memory d1, G2Point memory d2
    ) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](4);
        G2Point[] memory p2 = new G2Point[](4);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p1[3] = d1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        p2[3] = d2;
        return pairing(p1, p2);
    }
}
contract VerifierRayTracing10 {
    using Pairing for *;

    event IsVerified(bool indexed isVerifie, address indexed user, uint256[21] indexed input);

    struct VerifyingKey {
        Pairing.G1Point alfa1;
        Pairing.G2Point beta2;
        Pairing.G2Point gamma2;
        Pairing.G2Point delta2;
        Pairing.G1Point[] IC;
    }
    struct Proof {
        Pairing.G1Point A;
        Pairing.G2Point B;
        Pairing.G1Point C;
    }
    function verifyingKey() internal pure returns (VerifyingKey memory vk) {
        vk.alfa1 = Pairing.G1Point(
            20491192805390485299153009773594534940189261866228447918068658471970481763042,
            9383485363053290200918347156157836566562967994039712273449902621266178545958
        );

        vk.beta2 = Pairing.G2Point(
            [4252822878758300859123897981450591353533073413197771768651442665752259397132,
             6375614351688725206403948262868962793625744043794305715222011528459656738731],
            [21847035105528745403288232691147584728191162732299865338377159692350059136679,
             10505242626370262277552901082094356697409835680220590971873171140371331206856]
        );
        vk.gamma2 = Pairing.G2Point(
            [11559732032986387107991004021392285783925812861821192530917403151452391805634,
             10857046999023057135944570762232829481370756359578518086990519993285655852781],
            [4082367875863433681332203403145435568316851327593401208105741076214120093531,
             8495653923123431417604973247489272438418190587263600148770280649306958101930]
        );
        vk.delta2 = Pairing.G2Point(
            [11559732032986387107991004021392285783925812861821192530917403151452391805634,
             10857046999023057135944570762232829481370756359578518086990519993285655852781],
            [4082367875863433681332203403145435568316851327593401208105741076214120093531,
             8495653923123431417604973247489272438418190587263600148770280649306958101930]
        );
        vk.IC = new Pairing.G1Point[](22);
        
        vk.IC[0] = Pairing.G1Point( 
            13160004201638570490996223824881000383381326326769322058591216641246622881354,
            6531577250987884035142049213505945083961033987291042226799284256585953114345
        );                                      
        
        vk.IC[1] = Pairing.G1Point( 
            8153442796368969252591462027987766851529680610275233891685229475850137899441,
            20248293436554438056287655075864134665076785275443882881291574523964493302391
        );                                      
        
        vk.IC[2] = Pairing.G1Point( 
            19121678963855915698915983242287672776771656864736737306831975922111811871467,
            21527721168385089886774577493368910025121076083594173555790690067177952302762
        );                                      
        
        vk.IC[3] = Pairing.G1Point( 
            9652126543190598953301264766140378803393929213043454725177050304662411822784,
            13064113697066719466177116935820052269814600119761215340739293885693136279010
        );                                      
        
        vk.IC[4] = Pairing.G1Point( 
            338036917394591821605910818507757924183798409070578384893782955393030476584,
            12714843225486220241438394018305303756406942705789419969322598141935844134844
        );                                      
        
        vk.IC[5] = Pairing.G1Point( 
            5702512955747442450935226531815175763313703600709827493508012145845773109858,
            10083261756191735660821915088570448447569450177247858488184846269708203550444
        );                                      
        
        vk.IC[6] = Pairing.G1Point( 
            7053040238156787933817232810962304619957371356845230585530640815641086559456,
            10227514172503110151238269409059363278341870226657050516527761304776007978129
        );                                      
        
        vk.IC[7] = Pairing.G1Point( 
            21317813865548025887889564031777103632479445218340715015683848141944164860515,
            7429042825023028646335153238416636015046313487625859337327526069129112825224
        );                                      
        
        vk.IC[8] = Pairing.G1Point( 
            7715710901770867896366086413133780451356199500555026715517050194312710383287,
            21855542230592347335725228339850752754194258631903571957428835269851669595568
        );                                      
        
        vk.IC[9] = Pairing.G1Point( 
            4332407649428557391439070105502069420000065479081639488771876232615363917281,
            16225002286601796290519843905757138278883364672398421443677169332587720689577
        );                                      
        
        vk.IC[10] = Pairing.G1Point( 
            1846379385043765144240112344021446985598116667053065201922660720597967734912,
            17671959444966680103376864573331616502678410898184607519809174535454377122170
        );                                      
        
        vk.IC[11] = Pairing.G1Point( 
            4365025682136445986049166600878011558179604901401172389770436079106993214674,
            7451063948923434877990971063225348709364365044550840198558829904784071622413
        );                                      
        
        vk.IC[12] = Pairing.G1Point( 
            9282151235479558251872407083259656993119796615202547917339207024161976125938,
            8143319344611508359969206345551618923629987085436196135884503013573236428197
        );                                      
        
        vk.IC[13] = Pairing.G1Point( 
            11206704100599806067610301047895620400930574651102091271520597728987323330689,
            13098923299926792102257798882703495966066701264968712593590806713995465614971
        );                                      
        
        vk.IC[14] = Pairing.G1Point( 
            4329577611112001815382498098093559905694823662271247170720741830445814740865,
            16602851554556100652982182974476374445489132497534416327487677036422504033229
        );                                      
        
        vk.IC[15] = Pairing.G1Point( 
            6589590424838651430809835109460550155917138393505333579238881514942256204838,
            15213011592751380819530430231043226650635806022037854649698861185984781697585
        );                                      
        
        vk.IC[16] = Pairing.G1Point( 
            9462371409434598065909266812885499723974456107647021472321156288894892564489,
            20011255771094118041257458936190826166585771218419501547264628003783130815799
        );                                      
        
        vk.IC[17] = Pairing.G1Point( 
            8782310401696032070068402853272728423764465374723424724236455132805779219112,
            14844293473556409229534961676232711792219784136223756747371176026941512432663
        );                                      
        
        vk.IC[18] = Pairing.G1Point( 
            17672378988338645229120259133730441725160260995686805613322203074841717839183,
            469887676784470848842579612590256925384675234710248694655185868592774515138
        );                                      
        
        vk.IC[19] = Pairing.G1Point( 
            563202926686622546523425561539535227992531485200751803219332820612832800255,
            18862610850394323187451966288516058193949029973854041014672853818153466751099
        );                                      
        
        vk.IC[20] = Pairing.G1Point( 
            19491102637326963655998059343233921069210645233412419607181877571827323138131,
            340128335221038849395343456949147695649783276865319644303790811701393771427
        );                                      
        
        vk.IC[21] = Pairing.G1Point( 
            11820789404917235757140219734273832080727534813541991538307294844253731795916,
            11563815540091290139949527242418982961929374168905596718316706366665211377485
        );                                      
        
    }
    function verify(uint[] memory input, Proof memory proof) internal view returns (uint) {
        uint256 snark_scalar_field = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
        VerifyingKey memory vk = verifyingKey();
        require(input.length + 1 == vk.IC.length,"verifier-bad-input");
        // Compute the linear combination vk_x
        Pairing.G1Point memory vk_x = Pairing.G1Point(0, 0);
        for (uint i = 0; i < input.length; i++) {
            require(input[i] < snark_scalar_field,"verifier-gte-snark-scalar-field");
            vk_x = Pairing.addition(vk_x, Pairing.scalar_mul(vk.IC[i + 1], input[i]));
        }
        vk_x = Pairing.addition(vk_x, vk.IC[0]);
        if (!Pairing.pairingProd4(
            Pairing.negate(proof.A), proof.B,
            vk.alfa1, vk.beta2,
            vk_x, vk.gamma2,
            proof.C, vk.delta2
        )) return 1;
        return 0;
    }
    /// @return r  bool true if proof is valid
    function verifyProof(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[21] memory input
        ) public returns (bool r) {
        Proof memory proof;
        proof.A = Pairing.G1Point(a[0], a[1]);
        proof.B = Pairing.G2Point([b[0][0], b[0][1]], [b[1][0], b[1][1]]);
        proof.C = Pairing.G1Point(c[0], c[1]);
        uint[] memory inputValues = new uint[](input.length);
        for(uint i = 0; i < input.length; i++){
            inputValues[i] = input[i];
        }
        if (verify(inputValues, proof) == 0) {
            emit IsVerified(true, msg.sender, input);
            return true;
        } else {
            emit IsVerified(false, msg.sender, input);
            return false;
        }
    }
}
