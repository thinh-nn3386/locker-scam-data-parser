"use strict";
const type = {
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
})(ScamPhoneType || (ScamPhoneType = {}));
//# sourceMappingURL=ScamType.js.map