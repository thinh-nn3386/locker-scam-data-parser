const type=  {
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
  }

enum ScamPhoneType {
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
  Other = "other",
}
