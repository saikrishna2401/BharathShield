/**
 * URL Analyzer Module for PhishGuard
 * Extracts embedded links and performs deep signal analysis (Shorteners, IP links, TLD risk, Brand Mismatch).
 */

const KNOWN_SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 'is.gd', 't.co', 'cutt.ly', 'rb.gy', 'ow.ly',
  'tiny.cc', 'shorturl.at', 'buff.ly', 's.id', 'v.gd', 'clck.ru'
]);

const SUSPICIOUS_TLDS = new Set([
  'xyz', 'top', 'club', 'tk', 'ml', 'ga', 'cf', 'gq', 'online', 'vip',
  'site', 'work', 'tech', 'biz', 'info', 'link', 'click', 'live', 'support'
]);

const BRAND_PATTERNS = [
  { brand: 'SBI', regex: /sbi|state\s*bank/i, officialDomains: ['sbi.co.in', 'onlinesbi.sbi', 'onlinesbi.com'] },
  { brand: 'HDFC', regex: /hdfc/i, officialDomains: ['hdfcbank.com', 'hdfc.com'] },
  { brand: 'ICICI', regex: /icici/i, officialDomains: ['icicibank.com'] },
  { brand: 'AXIS', regex: /axis\s*bank/i, officialDomains: ['axisbank.com'] },
  { brand: 'PAYTM', regex: /paytm/i, officialDomains: ['paytm.com', 'paytmbank.com'] },
  { brand: 'PHONEPE', regex: /phonepe/i, officialDomains: ['phonepe.com'] },
  { brand: 'GPAY', regex: /gpay|google\s*pay/i, officialDomains: ['pay.google.com', 'google.com'] },
  { brand: 'AMAZON', regex: /amazon/i, officialDomains: ['amazon.in', 'amazon.com'] },
  { brand: 'TRAI', regex: /trai|telecom/i, officialDomains: ['trai.gov.in'] },
  { brand: 'INCOME_TAX', regex: /income\s*tax|itr/i, officialDomains: ['incometax.gov.in', 'gov.in'] },
  { brand: 'POST', regex: /india\s*post|courier/i, officialDomains: ['indiapost.gov.in'] }
];

function analyzeUrls(text, normalizedText = '') {
  if (!text || typeof text !== 'string') {
    return {
      hasUrl: false,
      urls: [],
      maxUrlRiskScore: 0,
      signals: []
    };
  }

  const combinedText = `${text} ${normalizedText}`;
  const urlRegex = /(https?:\/\/[^\s<>"'\(\)]+)|(www\.[^\s<>"'\(\)]+)|([a-zA-Z0-9-]+\.(?:xyz|top|club|tk|online|site|live|info|link|tech|vip|click)[^\s<>"'\(\)]*)/gi;

  const rawMatches = combinedText.match(urlRegex) || [];
  const uniqueUrls = Array.from(new Set(rawMatches));

  const analyzedUrls = [];
  const globalSignals = [];
  let maxUrlRiskScore = 0;

  for (const rawUrl of uniqueUrls) {
    let fullUrl = rawUrl;
    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
      fullUrl = 'http://' + fullUrl;
    }

    let parsed = null;
    try {
      parsed = new URL(fullUrl);
    } catch (e) {
      parsed = { hostname: rawUrl.split('/')[0], protocol: 'http:', pathname: '' };
    }

    const hostname = (parsed.hostname || '').toLowerCase();
    const isHttp = parsed.protocol === 'http:';
    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
    const parts = hostname.split('.');
    const tld = parts.length > 1 ? parts[parts.length - 1] : '';

    const isShortener = KNOWN_SHORTENERS.has(hostname);
    const isSuspiciousTld = SUSPICIOUS_TLDS.has(tld);
    const excessiveSubdomains = parts.length > 3;

    let brandMismatch = null;
    for (const b of BRAND_PATTERNS) {
      if (b.regex.test(combinedText)) {
        const isOfficial = b.officialDomains.some(d => hostname === d || hostname.endsWith('.' + d));
        if (!isOfficial) {
          brandMismatch = {
            claimedBrand: b.brand,
            actualDomain: hostname
          };
          break;
        }
      }
    }

    let urlScore = 0;
    const urlSignals = [];

    if (isHttp) {
      urlScore += 10;
      urlSignals.push({ key: 'HTTP_UNSECURE', type: 'HTTP_URL', score: 10 });
    }

    if (isIp) {
      urlScore += 25;
      urlSignals.push({ key: 'IP_ADDRESS_URL', type: 'IP_BASED_URL', score: 25 });
    }

    if (isShortener) {
      urlScore += 15;
      urlSignals.push({ key: 'URL_SHORTENER', type: 'SHORTENED_URL', score: 15 });
    }

    if (isSuspiciousTld) {
      urlScore += 15;
      urlSignals.push({ key: 'SUSPICIOUS_TLD', type: 'SUSPICIOUS_TLD', score: 15 });
    }

    if (excessiveSubdomains) {
      urlScore += 15;
      urlSignals.push({ key: 'EXCESSIVE_SUBDOMAINS', type: 'EXCESSIVE_SUBDOMAINS', score: 15 });
    }

    if (brandMismatch) {
      urlScore += 30;
      urlSignals.push({ key: 'BRAND_IMPERSONATION_URL', type: 'BRAND_DOMAIN_MISMATCH', score: 30 });
    }

    if (urlScore === 0) {
      urlScore = 10;
      urlSignals.push({ key: 'EMBEDDED_LINK', type: 'EMBEDDED_LINK', score: 10 });
    }

    if (urlScore > maxUrlRiskScore) {
      maxUrlRiskScore = urlScore;
    }

    analyzedUrls.push({
      originalUrl: rawUrl,
      fullUrl,
      domain: hostname,
      protocol: parsed.protocol || 'http:',
      isHttp,
      isIp,
      isShortener,
      isSuspiciousTld,
      brandMismatch,
      riskScore: Math.min(urlScore, 50),
      signals: urlSignals
    });

    globalSignals.push(...urlSignals);
  }

  return {
    hasUrl: analyzedUrls.length > 0,
    urls: analyzedUrls,
    maxUrlRiskScore: Math.min(maxUrlRiskScore, 50),
    signals: globalSignals
  };
}

module.exports = {
  analyzeUrls
};
