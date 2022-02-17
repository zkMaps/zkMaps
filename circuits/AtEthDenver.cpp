#include "circom.hpp"
#include "calcwit.hpp"
#define NSignals 280
#define NComponents 9
#define NOutputs 1
#define NInputs 2
#define NVars 256
#define NPublic 3
#define __P__ "21888242871839275222246405745257275088548364400416034343698204186575808495617"

/*
AtETHDenver
*/
void AtETHDenver_48f4f41af0613963(Circom_CalcWit *ctx, int __cIdx) {
    FrElement _sigValue[1];
    FrElement _sigValue_1[1];
    FrElement _sigValue_2[1];
    FrElement _sigValue_3[1];
    FrElement _sigValue_4[1];
    FrElement _sigValue_5[1];
    FrElement _sigValue_6[1];
    FrElement _sigValue_7[1];
    int _o_sigIdx_;
    int _compIdx;
    int _in_sigIdx_;
    int _offset_4;
    int _latitude_sigIdx_;
    int _compIdx_1;
    int _in_sigIdx__1;
    int _offset_5;
    int _compIdx_2;
    int _out_sigIdx_;
    int _compIdx_3;
    int _in_sigIdx__2;
    int _offset_7;
    int _longitude_sigIdx_;
    int _compIdx_4;
    int _in_sigIdx__3;
    int _offset_8;
    int _compIdx_5;
    int _out_sigIdx__1;
    int _compIdx_6;
    int _in_sigIdx__4;
    int _offset_10;
    int _compIdx_7;
    int _in_sigIdx__5;
    int _offset_12;
    int _compIdx_8;
    int _out_sigIdx__2;
    int _compIdx_9;
    int _in_sigIdx__6;
    int _offset_13;
    int _compIdx_10;
    int _in_sigIdx__7;
    int _offset_15;
    int _compIdx_11;
    int _out_sigIdx__3;
    Circom_Sizes _sigSizes_in;
    Circom_Sizes _sigSizes_in_1;
    Circom_Sizes _sigSizes_in_2;
    Circom_Sizes _sigSizes_in_3;
    Circom_Sizes _sigSizes_in_4;
    Circom_Sizes _sigSizes_in_5;
    Circom_Sizes _sigSizes_in_6;
    Circom_Sizes _sigSizes_in_7;
    _o_sigIdx_ = ctx->getSignalOffset(__cIdx, 0xaf63e24c8601f6beLL /* o */);
    _latitude_sigIdx_ = ctx->getSignalOffset(__cIdx, 0xf32bb51237e453a5LL /* latitude */);
    _longitude_sigIdx_ = ctx->getSignalOffset(__cIdx, 0xa15440e7c01a3feeLL /* longitude */);
    /* signal input latitude */
    /* signal input longitude */
    /* signal output o */
    /* o <== 1 */
    ctx->setSignal(__cIdx, __cIdx, _o_sigIdx_, (ctx->circuit->constants + 1));
    /* var northEastLatitude = 12973547807205027 */
    /* var northEastLongitude = 7501387182542445 */
    /* var southWestLatitude = 12973227978507761 */
    /* var southWestLongitude = 7500977777251778 */
    /* component lt1 = LessThan(64) */
    /* lt1.in[0] <== latitude */
    _compIdx = ctx->getSubComponentOffset(__cIdx, 0x12acc5191dfe3e34LL /* lt1 */);
    _in_sigIdx_ = ctx->getSignalOffset(_compIdx, 0x08b73807b55c4bbeLL /* in */);
    _sigSizes_in = ctx->getSignalSizes(_compIdx, 0x08b73807b55c4bbeLL /* in */);
    _offset_4 = _in_sigIdx_;
    ctx->multiGetSignal(__cIdx, __cIdx, _latitude_sigIdx_, _sigValue, 1);
    ctx->setSignal(__cIdx, _compIdx, _offset_4, _sigValue);
    /* lt1.in[1] <== northEastLatitude */
    _compIdx_1 = ctx->getSubComponentOffset(__cIdx, 0x12acc5191dfe3e34LL /* lt1 */);
    _in_sigIdx__1 = ctx->getSignalOffset(_compIdx_1, 0x08b73807b55c4bbeLL /* in */);
    _sigSizes_in_1 = ctx->getSignalSizes(_compIdx_1, 0x08b73807b55c4bbeLL /* in */);
    _offset_5 = _in_sigIdx__1 + 1*_sigSizes_in_1[1];
    ctx->setSignal(__cIdx, _compIdx_1, _offset_5, (ctx->circuit->constants + 2));
    /* lt1.out === 1 */
    _compIdx_2 = ctx->getSubComponentOffset(__cIdx, 0x12acc5191dfe3e34LL /* lt1 */);
    _out_sigIdx_ = ctx->getSignalOffset(_compIdx_2, 0x19f79b1921bbcfffLL /* out */);
    ctx->multiGetSignal(__cIdx, _compIdx_2, _out_sigIdx_, _sigValue_1, 1);
    ctx->checkConstraint(__cIdx, _sigValue_1, (ctx->circuit->constants + 1), "/Users/ronerlih/development/zk-maps/circuits/AtEthDenver.circom:54:4");
    /* component lt2 = LessThan(64) */
    /* lt2.in[0] <== longitude */
    _compIdx_3 = ctx->getSubComponentOffset(__cIdx, 0x12acc8191dfe434dLL /* lt2 */);
    _in_sigIdx__2 = ctx->getSignalOffset(_compIdx_3, 0x08b73807b55c4bbeLL /* in */);
    _sigSizes_in_2 = ctx->getSignalSizes(_compIdx_3, 0x08b73807b55c4bbeLL /* in */);
    _offset_7 = _in_sigIdx__2;
    ctx->multiGetSignal(__cIdx, __cIdx, _longitude_sigIdx_, _sigValue_2, 1);
    ctx->setSignal(__cIdx, _compIdx_3, _offset_7, _sigValue_2);
    /* lt2.in[1] <== northEastLongitude */
    _compIdx_4 = ctx->getSubComponentOffset(__cIdx, 0x12acc8191dfe434dLL /* lt2 */);
    _in_sigIdx__3 = ctx->getSignalOffset(_compIdx_4, 0x08b73807b55c4bbeLL /* in */);
    _sigSizes_in_3 = ctx->getSignalSizes(_compIdx_4, 0x08b73807b55c4bbeLL /* in */);
    _offset_8 = _in_sigIdx__3 + 1*_sigSizes_in_3[1];
    ctx->setSignal(__cIdx, _compIdx_4, _offset_8, (ctx->circuit->constants + 3));
    /* lt2.out === 1 */
    _compIdx_5 = ctx->getSubComponentOffset(__cIdx, 0x12acc8191dfe434dLL /* lt2 */);
    _out_sigIdx__1 = ctx->getSignalOffset(_compIdx_5, 0x19f79b1921bbcfffLL /* out */);
    ctx->multiGetSignal(__cIdx, _compIdx_5, _out_sigIdx__1, _sigValue_3, 1);
    ctx->checkConstraint(__cIdx, _sigValue_3, (ctx->circuit->constants + 1), "/Users/ronerlih/development/zk-maps/circuits/AtEthDenver.circom:60:4");
    /* component lt3 = LessThan(64) */
    /* lt3.in[0] <== southWestLatitude */
    _compIdx_6 = ctx->getSubComponentOffset(__cIdx, 0x12acc7191dfe419aLL /* lt3 */);
    _in_sigIdx__4 = ctx->getSignalOffset(_compIdx_6, 0x08b73807b55c4bbeLL /* in */);
    _sigSizes_in_4 = ctx->getSignalSizes(_compIdx_6, 0x08b73807b55c4bbeLL /* in */);
    _offset_10 = _in_sigIdx__4;
    ctx->setSignal(__cIdx, _compIdx_6, _offset_10, (ctx->circuit->constants + 4));
    /* lt3.in[1] <== latitude */
    _compIdx_7 = ctx->getSubComponentOffset(__cIdx, 0x12acc7191dfe419aLL /* lt3 */);
    _in_sigIdx__5 = ctx->getSignalOffset(_compIdx_7, 0x08b73807b55c4bbeLL /* in */);
    _sigSizes_in_5 = ctx->getSignalSizes(_compIdx_7, 0x08b73807b55c4bbeLL /* in */);
    _offset_12 = _in_sigIdx__5 + 1*_sigSizes_in_5[1];
    ctx->multiGetSignal(__cIdx, __cIdx, _latitude_sigIdx_, _sigValue_4, 1);
    ctx->setSignal(__cIdx, _compIdx_7, _offset_12, _sigValue_4);
    /* lt3.out === 1 */
    _compIdx_8 = ctx->getSubComponentOffset(__cIdx, 0x12acc7191dfe419aLL /* lt3 */);
    _out_sigIdx__2 = ctx->getSignalOffset(_compIdx_8, 0x19f79b1921bbcfffLL /* out */);
    ctx->multiGetSignal(__cIdx, _compIdx_8, _out_sigIdx__2, _sigValue_5, 1);
    ctx->checkConstraint(__cIdx, _sigValue_5, (ctx->circuit->constants + 1), "/Users/ronerlih/development/zk-maps/circuits/AtEthDenver.circom:66:4");
    /* component lt4 = LessThan(64) */
    /* lt4.in[0] <== southWestLongitude */
    _compIdx_9 = ctx->getSubComponentOffset(__cIdx, 0x12acc2191dfe391bLL /* lt4 */);
    _in_sigIdx__6 = ctx->getSignalOffset(_compIdx_9, 0x08b73807b55c4bbeLL /* in */);
    _sigSizes_in_6 = ctx->getSignalSizes(_compIdx_9, 0x08b73807b55c4bbeLL /* in */);
    _offset_13 = _in_sigIdx__6;
    ctx->setSignal(__cIdx, _compIdx_9, _offset_13, (ctx->circuit->constants + 5));
    /* lt4.in[1] <== longitude */
    _compIdx_10 = ctx->getSubComponentOffset(__cIdx, 0x12acc2191dfe391bLL /* lt4 */);
    _in_sigIdx__7 = ctx->getSignalOffset(_compIdx_10, 0x08b73807b55c4bbeLL /* in */);
    _sigSizes_in_7 = ctx->getSignalSizes(_compIdx_10, 0x08b73807b55c4bbeLL /* in */);
    _offset_15 = _in_sigIdx__7 + 1*_sigSizes_in_7[1];
    ctx->multiGetSignal(__cIdx, __cIdx, _longitude_sigIdx_, _sigValue_6, 1);
    ctx->setSignal(__cIdx, _compIdx_10, _offset_15, _sigValue_6);
    /* lt4.out === 1 */
    _compIdx_11 = ctx->getSubComponentOffset(__cIdx, 0x12acc2191dfe391bLL /* lt4 */);
    _out_sigIdx__3 = ctx->getSignalOffset(_compIdx_11, 0x19f79b1921bbcfffLL /* out */);
    ctx->multiGetSignal(__cIdx, _compIdx_11, _out_sigIdx__3, _sigValue_7, 1);
    ctx->checkConstraint(__cIdx, _sigValue_7, (ctx->circuit->constants + 1), "/Users/ronerlih/development/zk-maps/circuits/AtEthDenver.circom:72:4");
    ctx->finished(__cIdx);
}
/*
LessThan
in[1]=12973547807205027
n=64
*/
void LessThan_52b2ef03e2f29aa6(Circom_CalcWit *ctx, int __cIdx) {
    FrElement _sigValue[1];
    FrElement _tmp_2[1];
    FrElement _sigValue_1[1];
    FrElement _tmp_3[1];
    FrElement _sigValue_2[1];
    FrElement _tmp_4[1];
    int _compIdx;
    int _in_sigIdx_;
    int _in_sigIdx__1;
    int _offset_1;
    int _offset_3;
    int _compIdx_1;
    int _out_sigIdx_;
    int _offset_5;
    int _out_sigIdx__1;
    Circom_Sizes _sigSizes_in;
    Circom_Sizes _sigSizes_out;
    _in_sigIdx__1 = ctx->getSignalOffset(__cIdx, 0x08b73807b55c4bbeLL /* in */);
    _out_sigIdx__1 = ctx->getSignalOffset(__cIdx, 0x19f79b1921bbcfffLL /* out */);
    _sigSizes_in = ctx->getSignalSizes(__cIdx, 0x08b73807b55c4bbeLL /* in */);
    /* assert(n <= 252) */
    ctx->checkAssert(__cIdx, (ctx->circuit->constants + 1), "/Users/ronerlih/development/zk-maps/circuits/AtEthDenver.circom:21:4");
    /* signal input in[2] */
    /* signal output out */
    /* component n2b = Num2Bits(n+1) */
    /* n2b.in <== in[0]+ (1<<n) - in[1] */
    _compIdx = ctx->getSubComponentOffset(__cIdx, 0x21d8e21925f9f8c1LL /* n2b */);
    _in_sigIdx_ = ctx->getSignalOffset(_compIdx, 0x08b73807b55c4bbeLL /* in */);
    _offset_1 = _in_sigIdx__1;
    ctx->multiGetSignal(__cIdx, __cIdx, _offset_1, _sigValue, 1);
    Fr_add(_tmp_2, _sigValue, (ctx->circuit->constants + 6));
    _offset_3 = _in_sigIdx__1 + 1*_sigSizes_in[1];
    ctx->multiGetSignal(__cIdx, __cIdx, _offset_3, _sigValue_1, 1);
    Fr_sub(_tmp_3, _tmp_2, _sigValue_1);
    ctx->setSignal(__cIdx, _compIdx, _in_sigIdx_, _tmp_3);
    /* out <== 1-n2b.out[n] */
    _compIdx_1 = ctx->getSubComponentOffset(__cIdx, 0x21d8e21925f9f8c1LL /* n2b */);
    _out_sigIdx_ = ctx->getSignalOffset(_compIdx_1, 0x19f79b1921bbcfffLL /* out */);
    _sigSizes_out = ctx->getSignalSizes(_compIdx_1, 0x19f79b1921bbcfffLL /* out */);
    _offset_5 = _out_sigIdx_ + 64*_sigSizes_out[1];
    ctx->multiGetSignal(__cIdx, _compIdx_1, _offset_5, _sigValue_2, 1);
    Fr_sub(_tmp_4, (ctx->circuit->constants + 1), _sigValue_2);
    ctx->setSignal(__cIdx, __cIdx, _out_sigIdx__1, _tmp_4);
    ctx->finished(__cIdx);
}
/*
Num2Bits
n=65
*/
void Num2Bits_98695aa0f488e06b(Circom_CalcWit *ctx, int __cIdx) {
    FrElement _sigValue[1];
    FrElement _tmp_1[1];
    FrElement _tmp_2[1];
    FrElement _sigValue_1[1];
    FrElement _sigValue_2[1];
    FrElement _tmp_3[1];
    FrElement _tmp_4[1];
    FrElement _sigValue_3[1];
    FrElement _tmp_5[1];
    FrElement _tmp_6[1];
    FrElement lc1[1];
    FrElement _tmp_10[1];
    FrElement i[1];
    FrElement e2[1];
    FrElement _sigValue_4[1];
    FrElement _tmp_11[1];
    FrElement _tmp_12[1];
    FrElement _sigValue_5[1];
    FrElement _sigValue_6[1];
    FrElement _tmp_13[1];
    FrElement _tmp_14[1];
    FrElement _sigValue_7[1];
    FrElement _tmp_15[1];
    FrElement _tmp_16[1];
    FrElement _tmp_17[1];
    FrElement _tmp_19[1];
    FrElement _tmp_18[1];
    FrElement _tmp_20[1];
    FrElement _sigValue_8[1];
    int _in_sigIdx_;
    int _out_sigIdx_;
    int _offset_8;
    int _offset_10;
    int _offset_12;
    int _offset_15;
    int _offset_27;
    int _offset_29;
    int _offset_31;
    int _offset_34;
    Circom_Sizes _sigSizes_out;
    PFrElement _loopCond;
    Fr_copy(&(_tmp_10[0]), ctx->circuit->constants +1);
    Fr_copy(&(i[0]), ctx->circuit->constants +1);
    Fr_copy(&(e2[0]), ctx->circuit->constants +7);
    _in_sigIdx_ = ctx->getSignalOffset(__cIdx, 0x08b73807b55c4bbeLL /* in */);
    _out_sigIdx_ = ctx->getSignalOffset(__cIdx, 0x19f79b1921bbcfffLL /* out */);
    _sigSizes_out = ctx->getSignalSizes(__cIdx, 0x19f79b1921bbcfffLL /* out */);
    /* signal input in */
    /* signal output out[n] */
    /* var lc1=0 */
    /* var e2=1 */
    /* for (var i = 0;i<n;i++) */
    /* out[i] <-- (in >> i) & 1 */
    ctx->multiGetSignal(__cIdx, __cIdx, _in_sigIdx_, _sigValue, 1);
    Fr_shr(_tmp_1, _sigValue, (ctx->circuit->constants + 0));
    Fr_band(_tmp_2, _tmp_1, (ctx->circuit->constants + 1));
    _offset_8 = _out_sigIdx_;
    ctx->setSignal(__cIdx, __cIdx, _offset_8, _tmp_2);
    /* out[i] * (out[i] -1 ) === 0 */
    _offset_10 = _out_sigIdx_;
    ctx->multiGetSignal(__cIdx, __cIdx, _offset_10, _sigValue_1, 1);
    _offset_12 = _out_sigIdx_;
    ctx->multiGetSignal(__cIdx, __cIdx, _offset_12, _sigValue_2, 1);
    Fr_sub(_tmp_3, _sigValue_2, (ctx->circuit->constants + 1));
    Fr_mul(_tmp_4, _sigValue_1, _tmp_3);
    ctx->checkConstraint(__cIdx, _tmp_4, (ctx->circuit->constants + 0), "/Users/ronerlih/development/zk-maps/circuits/AtEthDenver.circom:12:8");
    /* lc1 += out[i] * e2 */
    _offset_15 = _out_sigIdx_;
    ctx->multiGetSignal(__cIdx, __cIdx, _offset_15, _sigValue_3, 1);
    Fr_mul(_tmp_5, _sigValue_3, (ctx->circuit->constants + 1));
    Fr_add(_tmp_6, (ctx->circuit->constants + 0), _tmp_5);
    Fr_copyn(lc1, _tmp_6, 1);
    /* e2 = e2+e2 */
    _loopCond = _tmp_10;
    while (Fr_isTrue(_loopCond)) {
        /* out[i] <-- (in >> i) & 1 */
        ctx->multiGetSignal(__cIdx, __cIdx, _in_sigIdx_, _sigValue_4, 1);
        Fr_shr(_tmp_11, _sigValue_4, i);
        Fr_band(_tmp_12, _tmp_11, (ctx->circuit->constants + 1));
        _offset_27 = _out_sigIdx_ + Fr_toInt(i)*_sigSizes_out[1];
        ctx->setSignal(__cIdx, __cIdx, _offset_27, _tmp_12);
        /* out[i] * (out[i] -1 ) === 0 */
        _offset_29 = _out_sigIdx_ + Fr_toInt(i)*_sigSizes_out[1];
        ctx->multiGetSignal(__cIdx, __cIdx, _offset_29, _sigValue_5, 1);
        _offset_31 = _out_sigIdx_ + Fr_toInt(i)*_sigSizes_out[1];
        ctx->multiGetSignal(__cIdx, __cIdx, _offset_31, _sigValue_6, 1);
        Fr_sub(_tmp_13, _sigValue_6, (ctx->circuit->constants + 1));
        Fr_mul(_tmp_14, _sigValue_5, _tmp_13);
        ctx->checkConstraint(__cIdx, _tmp_14, (ctx->circuit->constants + 0), "/Users/ronerlih/development/zk-maps/circuits/AtEthDenver.circom:12:8");
        /* lc1 += out[i] * e2 */
        _offset_34 = _out_sigIdx_ + Fr_toInt(i)*_sigSizes_out[1];
        ctx->multiGetSignal(__cIdx, __cIdx, _offset_34, _sigValue_7, 1);
        Fr_mul(_tmp_15, _sigValue_7, e2);
        Fr_add(_tmp_16, lc1, _tmp_15);
        Fr_copyn(lc1, _tmp_16, 1);
        /* e2 = e2+e2 */
        Fr_add(_tmp_17, e2, e2);
        Fr_copyn(e2, _tmp_17, 1);
        Fr_copyn(_tmp_19, i, 1);
        Fr_add(_tmp_18, i, (ctx->circuit->constants + 1));
        Fr_copyn(i, _tmp_18, 1);
        Fr_lt(_tmp_20, i, (ctx->circuit->constants + 8));
        _loopCond = _tmp_20;
    }
    /* lc1 === in */
    ctx->multiGetSignal(__cIdx, __cIdx, _in_sigIdx_, _sigValue_8, 1);
    ctx->checkConstraint(__cIdx, lc1, _sigValue_8, "/Users/ronerlih/development/zk-maps/circuits/AtEthDenver.circom:17:4");
    ctx->finished(__cIdx);
}
/*
LessThan
in[1]=7501387182542445
n=64
*/
void LessThan_28460c9295e91611(Circom_CalcWit *ctx, int __cIdx) {
    FrElement _sigValue[1];
    FrElement _tmp_2[1];
    FrElement _sigValue_1[1];
    FrElement _tmp_3[1];
    FrElement _sigValue_2[1];
    FrElement _tmp_4[1];
    int _compIdx;
    int _in_sigIdx_;
    int _in_sigIdx__1;
    int _offset_1;
    int _offset_3;
    int _compIdx_1;
    int _out_sigIdx_;
    int _offset_5;
    int _out_sigIdx__1;
    Circom_Sizes _sigSizes_in;
    Circom_Sizes _sigSizes_out;
    _in_sigIdx__1 = ctx->getSignalOffset(__cIdx, 0x08b73807b55c4bbeLL /* in */);
    _out_sigIdx__1 = ctx->getSignalOffset(__cIdx, 0x19f79b1921bbcfffLL /* out */);
    _sigSizes_in = ctx->getSignalSizes(__cIdx, 0x08b73807b55c4bbeLL /* in */);
    /* assert(n <= 252) */
    ctx->checkAssert(__cIdx, (ctx->circuit->constants + 1), "/Users/ronerlih/development/zk-maps/circuits/AtEthDenver.circom:21:4");
    /* signal input in[2] */
    /* signal output out */
    /* component n2b = Num2Bits(n+1) */
    /* n2b.in <== in[0]+ (1<<n) - in[1] */
    _compIdx = ctx->getSubComponentOffset(__cIdx, 0x21d8e21925f9f8c1LL /* n2b */);
    _in_sigIdx_ = ctx->getSignalOffset(_compIdx, 0x08b73807b55c4bbeLL /* in */);
    _offset_1 = _in_sigIdx__1;
    ctx->multiGetSignal(__cIdx, __cIdx, _offset_1, _sigValue, 1);
    Fr_add(_tmp_2, _sigValue, (ctx->circuit->constants + 6));
    _offset_3 = _in_sigIdx__1 + 1*_sigSizes_in[1];
    ctx->multiGetSignal(__cIdx, __cIdx, _offset_3, _sigValue_1, 1);
    Fr_sub(_tmp_3, _tmp_2, _sigValue_1);
    ctx->setSignal(__cIdx, _compIdx, _in_sigIdx_, _tmp_3);
    /* out <== 1-n2b.out[n] */
    _compIdx_1 = ctx->getSubComponentOffset(__cIdx, 0x21d8e21925f9f8c1LL /* n2b */);
    _out_sigIdx_ = ctx->getSignalOffset(_compIdx_1, 0x19f79b1921bbcfffLL /* out */);
    _sigSizes_out = ctx->getSignalSizes(_compIdx_1, 0x19f79b1921bbcfffLL /* out */);
    _offset_5 = _out_sigIdx_ + 64*_sigSizes_out[1];
    ctx->multiGetSignal(__cIdx, _compIdx_1, _offset_5, _sigValue_2, 1);
    Fr_sub(_tmp_4, (ctx->circuit->constants + 1), _sigValue_2);
    ctx->setSignal(__cIdx, __cIdx, _out_sigIdx__1, _tmp_4);
    ctx->finished(__cIdx);
}
/*
LessThan
in[0]=12973227978507761
n=64
*/
void LessThan_65c74ceb6480b50f(Circom_CalcWit *ctx, int __cIdx) {
    FrElement _sigValue[1];
    FrElement _tmp_2[1];
    FrElement _sigValue_1[1];
    FrElement _tmp_3[1];
    FrElement _sigValue_2[1];
    FrElement _tmp_4[1];
    int _compIdx;
    int _in_sigIdx_;
    int _in_sigIdx__1;
    int _offset_1;
    int _offset_3;
    int _compIdx_1;
    int _out_sigIdx_;
    int _offset_5;
    int _out_sigIdx__1;
    Circom_Sizes _sigSizes_in;
    Circom_Sizes _sigSizes_out;
    _in_sigIdx__1 = ctx->getSignalOffset(__cIdx, 0x08b73807b55c4bbeLL /* in */);
    _out_sigIdx__1 = ctx->getSignalOffset(__cIdx, 0x19f79b1921bbcfffLL /* out */);
    _sigSizes_in = ctx->getSignalSizes(__cIdx, 0x08b73807b55c4bbeLL /* in */);
    /* assert(n <= 252) */
    ctx->checkAssert(__cIdx, (ctx->circuit->constants + 1), "/Users/ronerlih/development/zk-maps/circuits/AtEthDenver.circom:21:4");
    /* signal input in[2] */
    /* signal output out */
    /* component n2b = Num2Bits(n+1) */
    /* n2b.in <== in[0]+ (1<<n) - in[1] */
    _compIdx = ctx->getSubComponentOffset(__cIdx, 0x21d8e21925f9f8c1LL /* n2b */);
    _in_sigIdx_ = ctx->getSignalOffset(_compIdx, 0x08b73807b55c4bbeLL /* in */);
    _offset_1 = _in_sigIdx__1;
    ctx->multiGetSignal(__cIdx, __cIdx, _offset_1, _sigValue, 1);
    Fr_add(_tmp_2, _sigValue, (ctx->circuit->constants + 6));
    _offset_3 = _in_sigIdx__1 + 1*_sigSizes_in[1];
    ctx->multiGetSignal(__cIdx, __cIdx, _offset_3, _sigValue_1, 1);
    Fr_sub(_tmp_3, _tmp_2, _sigValue_1);
    ctx->setSignal(__cIdx, _compIdx, _in_sigIdx_, _tmp_3);
    /* out <== 1-n2b.out[n] */
    _compIdx_1 = ctx->getSubComponentOffset(__cIdx, 0x21d8e21925f9f8c1LL /* n2b */);
    _out_sigIdx_ = ctx->getSignalOffset(_compIdx_1, 0x19f79b1921bbcfffLL /* out */);
    _sigSizes_out = ctx->getSignalSizes(_compIdx_1, 0x19f79b1921bbcfffLL /* out */);
    _offset_5 = _out_sigIdx_ + 64*_sigSizes_out[1];
    ctx->multiGetSignal(__cIdx, _compIdx_1, _offset_5, _sigValue_2, 1);
    Fr_sub(_tmp_4, (ctx->circuit->constants + 1), _sigValue_2);
    ctx->setSignal(__cIdx, __cIdx, _out_sigIdx__1, _tmp_4);
    ctx->finished(__cIdx);
}
/*
LessThan
in[0]=7500977777251778
n=64
*/
void LessThan_513f67dca34c33a0(Circom_CalcWit *ctx, int __cIdx) {
    FrElement _sigValue[1];
    FrElement _tmp_2[1];
    FrElement _sigValue_1[1];
    FrElement _tmp_3[1];
    FrElement _sigValue_2[1];
    FrElement _tmp_4[1];
    int _compIdx;
    int _in_sigIdx_;
    int _in_sigIdx__1;
    int _offset_1;
    int _offset_3;
    int _compIdx_1;
    int _out_sigIdx_;
    int _offset_5;
    int _out_sigIdx__1;
    Circom_Sizes _sigSizes_in;
    Circom_Sizes _sigSizes_out;
    _in_sigIdx__1 = ctx->getSignalOffset(__cIdx, 0x08b73807b55c4bbeLL /* in */);
    _out_sigIdx__1 = ctx->getSignalOffset(__cIdx, 0x19f79b1921bbcfffLL /* out */);
    _sigSizes_in = ctx->getSignalSizes(__cIdx, 0x08b73807b55c4bbeLL /* in */);
    /* assert(n <= 252) */
    ctx->checkAssert(__cIdx, (ctx->circuit->constants + 1), "/Users/ronerlih/development/zk-maps/circuits/AtEthDenver.circom:21:4");
    /* signal input in[2] */
    /* signal output out */
    /* component n2b = Num2Bits(n+1) */
    /* n2b.in <== in[0]+ (1<<n) - in[1] */
    _compIdx = ctx->getSubComponentOffset(__cIdx, 0x21d8e21925f9f8c1LL /* n2b */);
    _in_sigIdx_ = ctx->getSignalOffset(_compIdx, 0x08b73807b55c4bbeLL /* in */);
    _offset_1 = _in_sigIdx__1;
    ctx->multiGetSignal(__cIdx, __cIdx, _offset_1, _sigValue, 1);
    Fr_add(_tmp_2, _sigValue, (ctx->circuit->constants + 6));
    _offset_3 = _in_sigIdx__1 + 1*_sigSizes_in[1];
    ctx->multiGetSignal(__cIdx, __cIdx, _offset_3, _sigValue_1, 1);
    Fr_sub(_tmp_3, _tmp_2, _sigValue_1);
    ctx->setSignal(__cIdx, _compIdx, _in_sigIdx_, _tmp_3);
    /* out <== 1-n2b.out[n] */
    _compIdx_1 = ctx->getSubComponentOffset(__cIdx, 0x21d8e21925f9f8c1LL /* n2b */);
    _out_sigIdx_ = ctx->getSignalOffset(_compIdx_1, 0x19f79b1921bbcfffLL /* out */);
    _sigSizes_out = ctx->getSignalSizes(_compIdx_1, 0x19f79b1921bbcfffLL /* out */);
    _offset_5 = _out_sigIdx_ + 64*_sigSizes_out[1];
    ctx->multiGetSignal(__cIdx, _compIdx_1, _offset_5, _sigValue_2, 1);
    Fr_sub(_tmp_4, (ctx->circuit->constants + 1), _sigValue_2);
    ctx->setSignal(__cIdx, __cIdx, _out_sigIdx__1, _tmp_4);
    ctx->finished(__cIdx);
}
// Function Table
Circom_ComponentFunction _functionTable[6] = {
     AtETHDenver_48f4f41af0613963
    ,LessThan_52b2ef03e2f29aa6
    ,Num2Bits_98695aa0f488e06b
    ,LessThan_28460c9295e91611
    ,LessThan_65c74ceb6480b50f
    ,LessThan_513f67dca34c33a0
};
