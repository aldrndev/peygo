/**
 * Complete list of Indonesian banks
 * Source: Bank Indonesia / OJK official list
 */

export const INDONESIAN_BANKS = [
  // Big 4 State Banks (BUMN)
  { code: "BRI", name: "Bank Rakyat Indonesia (BRI)" },
  { code: "MANDIRI", name: "Bank Mandiri" },
  { code: "BNI", name: "Bank Negara Indonesia (BNI)" },
  { code: "BTN", name: "Bank Tabungan Negara (BTN)" },
  
  // Major Private Banks
  { code: "BCA", name: "Bank Central Asia (BCA)" },
  { code: "CIMB", name: "CIMB Niaga" },
  { code: "DANAMON", name: "Bank Danamon" },
  { code: "PANIN", name: "Bank Panin" },
  { code: "PERMATA", name: "Bank Permata" },
  { code: "OCBC", name: "OCBC NISP" },
  { code: "MAYBANK", name: "Maybank Indonesia" },
  { code: "UOB", name: "UOB Indonesia" },
  { code: "HSBC", name: "HSBC Indonesia" },
  { code: "CITIBANK", name: "Citibank" },
  { code: "STANDARD_CHARTERED", name: "Standard Chartered" },
  { code: "DBS", name: "DBS Indonesia" },
  
  // Sharia Banks
  { code: "BSI", name: "Bank Syariah Indonesia (BSI)" },
  { code: "MUAMALAT", name: "Bank Muamalat" },
  { code: "BCA_SYARIAH", name: "BCA Syariah" },
  { code: "CIMB_SYARIAH", name: "CIMB Niaga Syariah" },
  { code: "DANAMON_SYARIAH", name: "Danamon Syariah" },
  { code: "PERMATA_SYARIAH", name: "Permata Syariah" },
  { code: "MEGA_SYARIAH", name: "Bank Mega Syariah" },
  { code: "BTPN_SYARIAH", name: "BTPN Syariah" },
  
  // Regional Development Banks (BPD)
  { code: "BJB", name: "Bank BJB (Jabar Banten)" },
  { code: "DKI", name: "Bank DKI" },
  { code: "JATIM", name: "Bank Jatim" },
  { code: "JATENG", name: "Bank Jateng" },
  { code: "DIY", name: "Bank BPD DIY" },
  { code: "SUMUT", name: "Bank Sumut" },
  { code: "SUMSEL_BABEL", name: "Bank Sumsel Babel" },
  { code: "RIAU_KEPRI", name: "Bank Riau Kepri" },
  { code: "NAGARI", name: "Bank Nagari (Sumbar)" },
  { code: "JAMBI", name: "Bank Jambi" },
  { code: "BENGKULU", name: "Bank Bengkulu" },
  { code: "LAMPUNG", name: "Bank Lampung" },
  { code: "KALBAR", name: "Bank Kalbar" },
  { code: "KALTIM_KALTARA", name: "Bank Kaltimtara" },
  { code: "KALSEL", name: "Bank Kalsel" },
  { code: "KALTENG", name: "Bank Kalteng" },
  { code: "SULSELBAR", name: "Bank Sulselbar" },
  { code: "SULUT", name: "Bank SulutGo" },
  { code: "SULTENG", name: "Bank Sulteng" },
  { code: "SULTRA", name: "Bank Sultra" },
  { code: "MALUKU_MALUT", name: "Bank Maluku Malut" },
  { code: "PAPUA", name: "Bank Papua" },
  { code: "NTB_SYARIAH", name: "Bank NTB Syariah" },
  { code: "NTT", name: "Bank NTT" },
  { code: "BALI", name: "Bank BPD Bali" },
  { code: "ACEH", name: "Bank Aceh Syariah" },
  
  // Other Commercial Banks
  { code: "MEGA", name: "Bank Mega" },
  { code: "BUKOPIN", name: "Bank KB Bukopin" },
  { code: "SINARMAS", name: "Bank Sinarmas" },
  { code: "BTPN", name: "Bank BTPN" },
  { code: "JTRUST", name: "Bank JTrust Indonesia" },
  { code: "MNC", name: "Bank MNC Internasional" },
  { code: "COMMONWEALTH", name: "Commonwealth Bank" },
  { code: "BNPP", name: "Bank BNP Paribas" },
  { code: "RESONA", name: "Bank Resona Perdania" },
  { code: "MIZUHO", name: "Bank Mizuho Indonesia" },
  { code: "MUFG", name: "Bank MUFG" },
  { code: "WOORI", name: "Bank Woori Saudara" },
  { code: "SHINHAN", name: "Bank Shinhan Indonesia" },
  { code: "CCB", name: "CCB Indonesia" },
  { code: "ICBC", name: "ICBC Indonesia" },
  { code: "BOC", name: "Bank of China" },
  { code: "ANZ", name: "ANZ Indonesia" },
  { code: "DEUTSCHE", name: "Deutsche Bank" },
  { code: "JPMORGAN", name: "JPMorgan Chase" },
  { code: "AMERICAN_EXPRESS", name: "American Express" },
  
  // Digital Banks
  { code: "JAGO", name: "Bank Jago" },
  { code: "SEABANK", name: "SeaBank" },
  { code: "AMAR", name: "Bank Amar Indonesia" },
  { code: "NEO_COMMERCE", name: "Bank Neo Commerce" },
  { code: "ALADIN", name: "Bank Aladin Syariah" },
  { code: "ALLO", name: "Allo Bank" },
  { code: "SUPERBANK", name: "Superbank" },
  { code: "MOTION", name: "Motion Banking (MNC)" },
  { code: "LINE_BANK", name: "LINE Bank" },
  { code: "NOBU", name: "Nobu Bank" },
  { code: "TMRW", name: "TMRW by UOB" },
  { code: "DIGIBANK", name: "Digibank by DBS" },
  
  // E-Wallets / Payment Services (commonly used)
  { code: "GOPAY", name: "GoPay" },
  { code: "OVO", name: "OVO" },
  { code: "DANA", name: "DANA" },
  { code: "SHOPEEPAY", name: "ShopeePay" },
  { code: "LINKAJA", name: "LinkAja" },
  
  // Other
  { code: "OTHER", name: "Lainnya" },
] as const;

export type BankCode = typeof INDONESIAN_BANKS[number]["code"];

export function getBankName(code: string): string {
  const bank = INDONESIAN_BANKS.find(b => b.code === code);
  return bank?.name || code;
}
