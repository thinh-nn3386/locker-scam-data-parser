declare const scamTypeMapping: {
    fake_police: string;
    fake_electricity_company: string;
    fake_bank_credit_securities: string;
    phone_spam: string;
    online_delivery: string;
    fake_ads_prize: string;
    customer_service: string;
    real_estate: string;
    insurance: string;
    scam: string;
    other: string;
};
declare enum ScamPhoneType {
    FakePolice = "fake_police",
    FakeElectricityCompany = "fake_electricity_company",
    FakeBanking = "fake_bank_credit_securities",
    PhoneSpam = "phone_spam",
    OnlineDelivery = "online_delivery",
    FakePrize = "fake_ads_prize",
    CustomerService = "customer_service",
    RealEstate = "real_estate",
    Insurance = "insurance",
    Scam = "scam",
    Other = "other"
}
/**
 * Phân loại type từ CSV thành ScamPhoneType chuẩn
 * @param rawType - Type từ CSV (có thể có nhiều format khác nhau)
 * @returns ScamPhoneType - Type đã được phân loại
 */
export declare const classifyScamType: (rawType: string) => ScamPhoneType;
/**
 * Lấy mô tả tiếng Việt của ScamPhoneType
 * @param scamType - ScamPhoneType enum
 * @returns string - Mô tả tiếng Việt
 */
export declare const getScamTypeDescription: (scamType: ScamPhoneType) => string;
export { ScamPhoneType, scamTypeMapping };
//# sourceMappingURL=ScamType.d.ts.map