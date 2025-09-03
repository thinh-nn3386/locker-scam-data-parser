"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scamTypeMapping = exports.ScamPhoneType = exports.getScamTypeDescription = exports.classifyScamType = void 0;
const scamTypeMapping = {
    fake_police: "Giả mạo công an / dịch vụ công",
    fake_electricity_company: "Lừa đảo đóng tiền điện nước",
    fake_bank_credit_securities: "Giả mạo, lừa đảo ngân hàng / tín dụng / chứng khoán",
    phone_spam: "Nháy máy spam",
    online_delivery: "Giao hàng trực tuyến",
    fake_ads_prize: "Quảng cáo / trúng thưởng",
    customer_service: "Dịch vụ / CSKH / Tổng đài",
    real_estate: "Bất động sản",
    insurance: "Bảo hiểm",
    scam: "Lừa đảo",
    other: "Khác",
};
exports.scamTypeMapping = scamTypeMapping;
var ScamPhoneType;
(function (ScamPhoneType) {
    ScamPhoneType["FakePolice"] = "fake_police";
    ScamPhoneType["FakeElectricityCompany"] = "fake_electricity_company";
    ScamPhoneType["FakeBanking"] = "fake_bank_credit_securities";
    ScamPhoneType["PhoneSpam"] = "phone_spam";
    ScamPhoneType["OnlineDelivery"] = "online_delivery";
    ScamPhoneType["FakePrize"] = "fake_ads_prize";
    ScamPhoneType["CustomerService"] = "customer_service";
    ScamPhoneType["RealEstate"] = "real_estate";
    ScamPhoneType["Insurance"] = "insurance";
    ScamPhoneType["Scam"] = "scam";
    ScamPhoneType["Other"] = "other";
})(ScamPhoneType || (exports.ScamPhoneType = ScamPhoneType = {}));
/**
 * Phân loại type từ CSV thành ScamPhoneType chuẩn
 * @param rawType - Type từ CSV (có thể có nhiều format khác nhau)
 * @returns ScamPhoneType - Type đã được phân loại
 */
const classifyScamType = (rawType) => {
    if (!rawType || typeof rawType !== 'string') {
        return ScamPhoneType.Other;
    }
    // Chuyển về lowercase và loại bỏ khoảng trắng thừa để so sánh
    const normalizedType = rawType.toLowerCase().trim();
    // Giả mạo công an / dịch vụ công
    if (normalizedType.includes('công an') ||
        normalizedType.includes('police') ||
        normalizedType.includes('dịch vụ công') ||
        normalizedType.includes('công chức')) {
        return ScamPhoneType.FakePolice;
    }
    // Lừa đảo tiền điện nước
    if (normalizedType.includes('điện') ||
        normalizedType.includes('nước') ||
        normalizedType.includes('evn') ||
        normalizedType.includes('tiền điện')) {
        return ScamPhoneType.FakeElectricityCompany;
    }
    // Giả mạo ngân hàng / tín dụng / chứng khoán
    if (normalizedType.includes('ngân hàng') ||
        normalizedType.includes('bank') ||
        normalizedType.includes('tín dụng') ||
        normalizedType.includes('chứng khoán') ||
        normalizedType.includes('vp bank') ||
        normalizedType.includes('vietcombank') ||
        normalizedType.includes('acb') ||
        normalizedType.includes('techcombank') ||
        normalizedType.includes('bidv') ||
        normalizedType.includes('tài chính')) {
        return ScamPhoneType.FakeBanking;
    }
    // Nháy máy spam
    if (normalizedType.includes('nháy máy') ||
        normalizedType.includes('nhá máy') ||
        normalizedType.includes('spam call') ||
        normalizedType.includes('missed call')) {
        return ScamPhoneType.PhoneSpam;
    }
    // Giao hàng trực tuyến
    if (normalizedType.includes('giao hàng') ||
        normalizedType.includes('ship') ||
        normalizedType.includes('delivery') ||
        normalizedType.includes('vận chuyển') ||
        normalizedType.includes('grab') ||
        normalizedType.includes('shopee') ||
        normalizedType.includes('lazada')) {
        return ScamPhoneType.OnlineDelivery;
    }
    // Quảng cáo / trúng thưởng
    if (normalizedType.includes('quảng cáo') ||
        normalizedType.includes('trúng thưởng') ||
        normalizedType.includes('khuyến mãi') ||
        normalizedType.includes('voucher') ||
        normalizedType.includes('giải thưởng') ||
        normalizedType.includes('ads')) {
        return ScamPhoneType.FakePrize;
    }
    // Dịch vụ / CSKH / Tổng đài
    if (normalizedType.includes('cskh') ||
        normalizedType.includes('chăm sóc khách hàng') ||
        normalizedType.includes('tổng đài') ||
        normalizedType.includes('hỗ trợ') ||
        normalizedType.includes('customer service') ||
        normalizedType.includes('dịch vụ')) {
        return ScamPhoneType.CustomerService;
    }
    // Bất động sản
    if (normalizedType.includes('bất động sản') ||
        normalizedType.includes('nhà đất') ||
        normalizedType.includes('real estate') ||
        normalizedType.includes('môi giới') ||
        normalizedType.includes('căn hộ') ||
        normalizedType.includes('chung cư')) {
        return ScamPhoneType.RealEstate;
    }
    // Bảo hiểm
    if (normalizedType.includes('bảo hiểm') ||
        normalizedType.includes('insurance') ||
        normalizedType.includes('daichi') ||
        normalizedType.includes('prudential') ||
        normalizedType.includes('manulife')) {
        return ScamPhoneType.Insurance;
    }
    // Lừa đảo
    if (normalizedType.includes('lừa đảo') ||
        normalizedType.includes('lừa') ||
        normalizedType.includes('đảo') ||
        normalizedType.includes('scam') ||
        normalizedType.includes('fraud') ||
        normalizedType.includes('đòi nợ') ||
        normalizedType.includes('lua dao')) {
        return ScamPhoneType.Scam;
    }
    // Spam (default cho các loại spam chung chung)
    if (normalizedType.includes('spam') ||
        normalizedType.includes('bot') ||
        normalizedType.includes('rác')) {
        return ScamPhoneType.PhoneSpam;
    }
    // Mặc định
    return ScamPhoneType.Other;
};
exports.classifyScamType = classifyScamType;
/**
 * Lấy mô tả tiếng Việt của ScamPhoneType
 * @param scamType - ScamPhoneType enum
 * @returns string - Mô tả tiếng Việt
 */
const getScamTypeDescription = (scamType) => {
    return scamTypeMapping[scamType] || scamTypeMapping.other;
};
exports.getScamTypeDescription = getScamTypeDescription;
//# sourceMappingURL=ScamType.js.map