
import { Company, Investor, Watchlist, AnnouncementItem, Sentiment, MarketResultItem, SavedItem, SmartMoneyActivity, CorporateAction, KeyDocument, AlertPreference } from '../types';
import { FilterCategoriesData } from '../constants';

export const mockCompanies: Company[] = [
  { id: '1', name: 'Reliance Industries Ltd', ticker: 'RELIANCE', isin: 'INE002A01018' },
  { id: '2', name: 'Tata Consultancy Services Ltd', ticker: 'TCS', isin: 'INE467B01029' },
  { id: '3', name: 'HDFC Bank Ltd', ticker: 'HDFCBANK', isin: 'INE040A01034' },
  { id: '4', name: 'Infosys Ltd', ticker: 'INFY', isin: 'INE009A01021' },
  { id: '5', name: 'ICICI Bank Ltd', ticker: 'ICICIBANK', isin: 'INE090A01021' },
  { id: '6', name: 'New India Assurance Company Ltd', ticker: 'NIACL', isin: 'INE470Y01017' },
  { id: '7', name: 'Indo Farm Equipment Ltd', ticker: 'INDOFARM', isin: 'INE022R01010' },
  { id: '8', name: 'Lupin Ltd', ticker: 'LUPIN', isin: 'INE326A01037' },
  { id: '9', name: 'RattanIndia Power Ltd', ticker: 'RTNPOWER', isin: 'INE399K01017' },
  { id: '10', name: 'Royal India Corporation Ltd', ticker: 'ROYALIND', isin: 'INE330P01012' },
  { id: '11', name: 'Rossari Biotech Ltd', ticker: 'ROSSARI', isin: 'INE02A801020' },
  { id: '12', name: 'Knowledge Marine & Engineering Works Ltd', ticker: 'KMEW', isin: 'INE0C3801016' },
  { id: '13', name: 'Mid East Portfolio Management Ltd', ticker: 'MIDEASTP', isin: 'INE124C01013' },
  { id: '14', name: 'ICICI Lombard General Insurance Company Ltd', ticker: 'ICICIGI', isin: 'INE765G01017' },
  { id: '15', name: 'Alkyl Amines Chemicals Ltd', ticker: 'ALKYLAMINE', isin: 'INE152A01021' },
  { id: '16', name: 'AMS Polymers Ltd', ticker: 'AMSPOLY', isin: 'INE034S01015' },
  { id: '17', name: 'Bank of Maharashtra', ticker: 'MAHABANK', isin: 'INE457A01014' },
  { id: '18', name: 'JTL Industries Ltd', ticker: 'JTLIND', isin: 'INE392L01020' },
  { id: '19', name: 'Life Insurance Corporation of India', ticker: 'LICI', isin: 'INE0J1Y01017' },
  { id: '20', name: 'Piramal Enterprises Ltd', ticker: 'PEL', isin: 'INE140A01024' },
  { id: '21', name: 'Stanley Lifestyles Ltd', ticker: 'STANLEY', isin: 'INE01CY0102 Stanley' }, // Assuming ISIN, made unique
  { id: '22', name: 'Auro Impex & Chemicals Ltd', ticker: 'AUROIMPEX', isin: 'INE02X901011' },
  { id: '23', name: 'Shri Kalyan Holdings Ltd', ticker: 'SHKALYN', isin: 'INE788G01019' },
  { id: '24', name: 'Menon Bearings Ltd', ticker: 'MENONBE', isin: 'INE071D01025' },
  { id: '25', name: 'Ambuja Cements Ltd', ticker: 'AMBUJACEM', isin: 'INE079A01024' },
  { id: '26', name: 'Sportking India Ltd', ticker: 'SPORTKING', isin: 'INE429G01011' },
  { id: '27', name: 'Heubach Colorants India Ltd', ticker: 'HEUBACHIND', isin: 'INE195D01027' },
  { id: '28', name: 'Dalmia Bharat Ltd', ticker: 'DALBHARAT', isin: 'INE00R101023' },
  { id: '29', name: 'Adani Green Energy Ltd', ticker: 'ADANIGREEN', isin: 'INE364U01010' },
  { id: '30', name: 'Adani Ports & Special Economic Zone Ltd', ticker: 'ADANIPORTS', isin: 'INE742F01042' },
  { id: '31', name: 'V-Mart Retail Ltd', ticker: 'VMART', isin: 'INE665J01013' },
  { id: '32', name: 'Railtel Corporation of India Ltd', ticker: 'RAILTEL', isin: 'INE035N01012' },
  { id: '33', name: 'Gretex Corporate Services Ltd', ticker: 'GCSL', isin: 'INE0HOK01016' },
  { id: '34', name: 'Agro Tech Foods Ltd', ticker: 'SUNDROPFOODS', isin: 'INE214A01019' }, 
  { id: '35', name: 'Konndor Industries Ltd', ticker: 'KONNDOR', isin: 'INE9 Konndor' }, // Assuming ISIN, made unique
  { id: '36', name: 'SIS Ltd', ticker: 'SIS', isin: 'INE285J01028' },
  { id: '37', name: 'Cupid Breweries & Distilleries Ltd', ticker: 'CUPIDALBV', isin: 'INE0 CupidB' }, // Assuming ISIN
  { id: '38', name: 'Tech Mahindra Ltd', ticker: 'TECHM', isin: 'INE669A01023' },
  { id: '39', name: 'LIC Housing Finance Ltd', ticker: 'LICHSGFIN', isin: 'INE115A01026' },
  { id: '40', name: 'Greaves Cotton Ltd', ticker: 'GREAVESCOT', isin: 'INE224A01026' },
  { id: '41', name: 'Wipro Ltd', ticker: 'WIPRO', isin: 'INE075A01022' },
  { id: '42', name: 'Grindwell Norton Ltd', ticker: 'GRINDWELL', isin: 'INE536A01024' },
  { id: '43', name: 'Kirloskar Pneumatic Company Ltd', ticker: 'KIRLPNU', isin: 'INE075C01020' },
  { id: '44', name: 'Compuage Infocom Ltd', ticker: 'COMPINFO', isin: 'INE075B01016' },
  { id: '45', name: 'PNC Infratech Ltd', ticker: 'PNCINFRA', isin: 'INE195J01029' },
  { id: '46', name: 'Avanti Feeds Ltd', ticker: 'AVANTIFEED', isin: 'INE871C01038' },
  { id: '47', name: 'Pilani Investment & Industries Corporation Ltd', ticker: 'PILANIINVS', isin: 'INE417A01014' },
];

export const mockInvestors: Investor[] = [
  { id: 'inv1', name: 'Ashish Kacholia', isFollowed: true },
  { id: 'inv2', name: 'Mukul Agrawal', isFollowed: false },
  { id: 'inv3', name: 'Rakesh Jhunjhunwala Estate', isFollowed: true },
  { id: 'inv4', name: 'Radhakishan Damani', isFollowed: false },
  { id: 'inv5', name: 'Vijay Kedia', isFollowed: true },
  { id: 'inv6', name: 'Nemish Shah', isFollowed: false },
  { id: 'inv7', name: 'Dolly Khanna', isFollowed: false },
  { id: 'inv8', name: 'Porinju Veliyath', isFollowed: false },
  { id: 'inv9', name: 'Anil Kumar Goel', isFollowed: true },
];

// Helper to get ISINs for given company IDs
const getIsinsForCompanyIds = (companyIds: string[]): string[] => {
  return companyIds.map(id => mockCompanies.find(c => c.id === id)?.isin).filter(isin => !!isin) as string[];
};

export const mockWatchlists: Watchlist[] = [
  { 
    id: 'wl_smart', 
    name: 'Smart Alerts', 
    companies: ['15', '3', '1'], 
    isins: getIsinsForCompanyIds(['15', '3', '1']),
    categories: ['Financial Results', 'Mergers/Acquisitions', 'Annual Report'], 
    superInvestors: ['inv1', 'inv3'], 
    isSmartAlerts: true,
    alertPreference: 'smart_alerts' 
  },
  { 
    id: 'wl2', 
    name: 'My Watchlist 1', 
    companies: ['1', '2', '3'], 
    isins: getIsinsForCompanyIds(['1', '2', '3']),
    categories: ['Investor/Analyst Meet'], 
    superInvestors: ['inv3'],
    alertPreference: 'daily_summary'
  },
  { 
    id: 'wl3', 
    name: 'Pharma Track', 
    companies: ['8'], 
    isins: getIsinsForCompanyIds(['8']),
    categories: ['Regulatory Approvals/Orders', 'Financial Results'], 
    superInvestors: ['inv5'],
    alertPreference: 'no_alerts'
  },
  { 
    id: 'wl4', 
    name: 'Core Portfolio', 
    companies: ['1', '2', '3', '4', '5'], 
    isins: getIsinsForCompanyIds(['1', '2', '3', '4', '5']),
    categories: ['Annual Report', 'Financial Results', 'Investor/Analyst Meet', 'Bonus/Stock Split'], 
    superInvestors: ['inv1', 'inv3', 'inv5'],
    alertPreference: 'daily_summary'
  },
];

const escapeHtml = (unsafe: any): string => {
  if (typeof unsafe !== 'string') {
    if (unsafe === null || unsafe === undefined) return '';
    return String(unsafe);
  }
  return unsafe
       .replace(/&/g, "&amp;")
       .replace(/</g, "&lt;")
       .replace(/>/g, "&gt;")
       .replace(/"/g, "&quot;")
       .replace(/'/g, "&#039;");
};

const newItemData = {
  "Company": "Kirloskar Pneumatic Company Ltd",
  "Category": "Procedural/Administrative",
  "Date": "2025-06-08",
  "Headline": "Kirloskar Pneumatic Company Ltd: Employee Benefits Update and Financial Report Highlights",
  "AI_Summary": "Kirloskar Pneumatic Company Ltd released a statement on June 8th, 2025, providing an update on employee benefits and highlighting key figures from its financial reports.  The company disclosed details concerning its defined contribution plans, with an expense of ₹71.37 million recognized (compared to ₹63.09 million in the previous year).  This amount is included in 'Employee benefits expense' in Note 23 of the Profit and Loss statement.  Further details were provided regarding defined benefit plans for gratuity, outlining eligibility criteria and payment calculations based on years of service.  Please see the table below for a detailed breakdown of the company's operating segment performance.  Important notes clarify that employee-wise gratuity contributions are not individually ascertainable, and the liability for leave entitlement is not included in gross remuneration due to the lack of employee-wise actuarial valuation data.",
  "Financial_Table": {
    "title": "DETAILS OF OPERATING SEGMENT - IND AS 108",
    "subtitle": "(₹ in Million)",
    "columns": [
      {"Sr. No.": null, "Particulars": null, "COMPRESSION SYSTEMS (2023-24)": null, "OTHER NON-REPORTABLE SEGMENTS (2023-24)": null, "TOTAL (2023-24)": null, "COMPRESSION SYSTEMS (2022-23)": null, "OTHER NON-REPORTABLE SEGMENTS (2022-23)": null, "TOTAL (2022-23)": null},
      {"Sr. No.": "1", "Particulars": "Sales/Inter Segment", "COMPRESSION SYSTEMS (2023-24)": "12,299.52", "OTHER NON-REPORTABLE SEGMENTS (2023-24)": "926.68", "TOTAL (2023-24)": "13,226.20", "COMPRESSION SYSTEMS (2022-23)": "11,569.44", "OTHER NON-REPORTABLE SEGMENTS (2022-23)": "823.93", "TOTAL (2022-23)": "12,393.37"},
      {"Sr. No.": " ", "Particulars": "Less: Inter Revenue", "COMPRESSION SYSTEMS (2023-24)": "-", "OTHER NON-REPORTABLE SEGMENTS (2023-24)": "-", "TOTAL (2023-24)": "-", "COMPRESSION SYSTEMS (2022-23)": "-", "OTHER NON-REPORTABLE SEGMENTS (2022-23)": "-", "TOTAL (2022-23)": "-"},
      {"Sr. No.": " ", "Particulars": "Net Revenue from Operations", "COMPRESSION SYSTEMS (2023-24)": "12,299.52", "OTHER NON-REPORTABLE SEGMENTS (2023-24)": "926.68", "TOTAL (2023-24)": "13,226.20", "COMPRESSION SYSTEMS (2022-23)": "11,569.44", "OTHER NON-REPORTABLE SEGMENTS (2022-23)": "823.93", "TOTAL (2022-23)": "12,393.37"},
      {"Sr. No.": "2", "Particulars": "Operating Result (Net of Income)", "COMPRESSION SYSTEMS (2023-24)": "2,435.98", "OTHER NON-REPORTABLE SEGMENTS (2023-24)": "(656.66)", "TOTAL (2023-24)": "1,779.32", "COMPRESSION SYSTEMS (2022-23)": "2,086.95", "OTHER NON-REPORTABLE SEGMENTS (2022-23)": "(653.41)", "TOTAL (2022-23)": "1,433.54"},
      {"Sr. No.": " ", "Particulars": "Segment Result Before Interest", "COMPRESSION SYSTEMS (2023-24)": null, "OTHER NON-REPORTABLE SEGMENTS (2023-24)": null, "TOTAL (2023-24)": "1,779.32", "COMPRESSION SYSTEMS (2022-23)": null, "OTHER NON-REPORTABLE SEGMENTS (2022-23)": null, "TOTAL (2022-23)": "1,433.54"},      
      {"Sr. No.": " ", "Particulars": "Less: Finance Cost", "COMPRESSION SYSTEMS (2023-24)": null, "OTHER NON-REPORTABLE SEGMENTS (2023-24)": null, "TOTAL (2023-24)": "0.57", "COMPRESSION SYSTEMS (2022-23)": null, "OTHER NON-REPORTABLE SEGMENTS (2022-23)": null, "TOTAL (2022-23)": "0.76"},
      {"Sr. No.": " ", "Particulars": "Profit Before Tax", "COMPRESSION SYSTEMS (2023-24)": null, "OTHER NON-REPORTABLE SEGMENTS (2023-24)": null, "TOTAL (2023-24)": "1,778.75", "COMPRESSION SYSTEMS (2022-23)": null, "OTHER NON-REPORTABLE SEGMENTS (2022-23)": null, "TOTAL (2022-23)": "1,432.78"},
      {"Sr. No.": "3", "Particulars": "Other Information", "COMPRESSION SYSTEMS (2023-24)": "7028.93", "OTHER NON-REPORTABLE SEGMENTS (2023-24)": "6,821.44", "TOTAL (2023-24)": "13,850.37", "COMPRESSION SYSTEMS (2022-23)": "5,961.19", "OTHER NON-REPORTABLE SEGMENTS (2022-23)": "5,334.06", "TOTAL (2022-23)": "11,295.25"},
      {"Sr. No.": " ", "Particulars": "Segment Assets", "COMPRESSION SYSTEMS (2023-24)": "4,054.20", "OTHER NON-REPORTABLE SEGMENTS (2023-24)": "549.82", "TOTAL (2023-24)": "4,604.02", "COMPRESSION SYSTEMS (2022-23)": "2,903.66", "OTHER NON-REPORTABLE SEGMENTS (2022-23)": "439.88", "TOTAL (2022-23)": "3,343.54"},
      {"Sr. No.": " ", "Particulars": "Total Liabilities", "COMPRESSION SYSTEMS (2023-24)": null, "OTHER NON-REPORTABLE SEGMENTS (2023-24)": null, "TOTAL (2023-24)": "13,850.37", "COMPRESSION SYSTEMS (2022-23)": null, "OTHER NON-REPORTABLE SEGMENTS (2022-23)": null, "TOTAL (2022-23)": "11,295.25"},
      {"Sr. No.": "4", "Particulars": "Capital Expenditure During the year", "COMPRESSION SYSTEMS (2023-24)": "256.01", "OTHER NON-REPORTABLE SEGMENTS (2023-24)": "344.75", "TOTAL (2023-24)": "600.76", "COMPRESSION SYSTEMS (2022-23)": "222.96", "OTHER NON-REPORTABLE SEGMENTS (2022-23)": "54.53", "TOTAL (2022-23)": "277.49"},
      {"Sr. No.": "5", "Particulars": "Depreciation and Impairment", "COMPRESSION SYSTEMS (2023-24)": "218.12", "OTHER NON-REPORTABLE SEGMENTS (2023-24)": "138.55", "TOTAL (2023-24)": "356.67", "COMPRESSION SYSTEMS (2022-23)": "204.05", "OTHER NON-REPORTABLE SEGMENTS (2022-23)": "131.32", "TOTAL (2022-23)": "335.37"}
    ],
    "notes": [
        "All Assets of the Company are located within India"
      ]
  },
  "Employee_Benefits_Details": {
    "defined_contribution_plans": "Amount of ₹71.37 Million (Previous Year ₹63.09 Million) is recognised as an expense and included in \"Employees benefits expense\" in Note 23 in the statement of Profit and Loss.",
    "defined_benefit_plans_gratuity": "The Company operates a gratuity plan where every employee is entitled to benefits as per the company scheme. Gratuity is payable upon service termination or retirement, whichever comes first, at a rate of 15 days' salary for each completed year (less than 15 years of service) or one month's salary for each completed year (more than 15 years of service), subject to a maximum of 25 to 28 months' salary depending on the employee's category, ensuring compliance with The Payment of Gratuity Act, 1972.  Benefits vest after five years of continuous service.",
    "notes": [
      "As the employee-wise breakup of contribution to the gratuity fund is not ascertainable, the same has been included on the basis of entitlement in gross remuneration.",
      "As the employee-wise breakup of liability of leave entitlement, based on actuarial valuation, is not ascertainable, the same has not been included in gross remuneration."
    ]
  }
};

let aiSummaryHtml = `<p>${escapeHtml(newItemData.AI_Summary)}</p>`;

if (newItemData.Financial_Table) {
  const financialTable = newItemData.Financial_Table;
  const headerKeys = Object.keys(financialTable.columns[0]);
  
  aiSummaryHtml += `
    <h3 class="mt-3 mb-1 text-md font-semibold">${escapeHtml(financialTable.title)}</h3>
    ${financialTable.subtitle ? `<p class="mb-2 text-sm text-gray-600"><em>${escapeHtml(financialTable.subtitle)}</em></p>` : ''}
    <div class="overflow-x-auto rounded-md border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            ${headerKeys.map(key => `<th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 last:border-r-0">${escapeHtml(key)}</th>`).join('')}
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          ${financialTable.columns.slice(1).map(row => `
            <tr class="hover:bg-gray-50">
              ${headerKeys.map(key => `<td class="px-3 py-2 whitespace-nowrap text-xs text-gray-700 border-r border-gray-200 last:border-r-0">${escapeHtml(row[key])}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ${financialTable.notes && financialTable.notes.length > 0 ? `<p class="mt-2 text-xs text-gray-500"><small>${financialTable.notes.map(note => escapeHtml(note)).join('<br>')}</small></p>` : ''}
  `;
}

if (newItemData.Employee_Benefits_Details) {
  const benefitsDetails = newItemData.Employee_Benefits_Details;
  aiSummaryHtml += `
    <h3 class="mt-4 mb-1 text-md font-semibold">Employee Benefits Details</h3>
    <h4 class="mt-2 text-sm font-medium text-gray-700">Defined Contribution Plans</h4>
    <p class="text-xs text-gray-600">${escapeHtml(benefitsDetails.defined_contribution_plans)}</p>
    <h4 class="mt-2 text-sm font-medium text-gray-700">Defined Benefit Plans (Gratuity)</h4>
    <p class="text-xs text-gray-600">${escapeHtml(benefitsDetails.defined_benefit_plans_gratuity)}</p>
    ${benefitsDetails.notes && benefitsDetails.notes.length > 0 ? `
      <h5 class="mt-2 text-sm font-medium text-gray-700">Notes:</h5>
      <ul class="list-disc list-inside text-xs text-gray-600 pl-4">
        ${benefitsDetails.notes.map(note => `<li>${escapeHtml(note)}</li>`).join('')}
      </ul>
    ` : ''}
  `;
}


const kirloskarAnnouncement: AnnouncementItem = {
  id: 'newAnn95',
  company: mockCompanies.find(c => c.ticker === 'KIRLPNU')!,
  category: newItemData.Category,
  headline: newItemData.Headline,
  sentiment: Sentiment.Neutral,
  date: new Date(newItemData.Date + 'T09:00:00Z').toISOString(),
  aiSummary: aiSummaryHtml,
  isSaved: false, 
};

const allSubCategories = FilterCategoriesData.flatMap(cat => cat.subCategories.map(sub => sub.name.split(' (')[0]));

const generateNewAnnouncements = (count: number): AnnouncementItem[] => {
    const newItems: AnnouncementItem[] = [];
    for (let i = 1; i <= count; i++) { // Start from newAnn1
        const company = mockCompanies[i % mockCompanies.length];
        const category = allSubCategories[i % allSubCategories.length];
        const sentiment = [Sentiment.Positive, Sentiment.Neutral, Sentiment.Negative][i % 3];
        
        const date = new Date();
        date.setDate(date.getDate() - (i % 180)); // Spread over last ~6 months
        date.setHours(9 + (i % 9), (i * 13) % 60, 0, 0); // Vary times
        const isoDate = date.toISOString();

        let headline = '';
        let summary = '';

        switch (category) {
            case "Annual Report":
                headline = `${company.name} releases its Annual Report for FY${new Date().getFullYear() -1}-${new Date().getFullYear().toString().slice(-2)}.`;
                summary = `<p>${company.name} has published its comprehensive annual report, detailing financial performance, strategic initiatives, and future outlook. Key highlights include revenue growth of ${(i%15)+5}% and net profit of INR ${(i%50)+10} Cr.</p>`;
                break;
            case "Investor/Analyst Meet":
                headline = `Update on Investor/Analyst Meet for ${company.name}.`;
                summary = `<p>${company.name} hosted an investor and analyst meet on ${new Date(date.getTime() - 86400000 * 7).toLocaleDateString('en-CA')} to discuss recent performance and answer queries. Management provided insights into their operational strategies and market positioning.</p>`;
                break;
            case "Financial Results":
                headline = `${company.name} announces Q${(i%4)+1} ${new Date().getFullYear()} financial results.`;
                summary = `<p>${company.name} reported its financial results for the quarter ending ${new Date(date.getFullYear(), (Math.floor(i/4)%4)*3 + 2, 0).toLocaleDateString('en-CA')}. The company saw ${sentiment === Sentiment.Positive ? 'strong' : sentiment === Sentiment.Negative ? 'subdued' : 'mixed'} performance in key segments. Detailed figures are available in the full release.</p>`;
                break;
            case "Change in KMP":
                headline = `Key Managerial Personnel change at ${company.name}.`;
                summary = `<p>${company.name} announced a change in its Key Managerial Personnel. Mr./Ms. ${(i%2 === 0 ? 'Ravi Kumar' : 'Priya Sharma')} has been appointed as ${ (i%3 === 0 ? 'Chief Financial Officer' : i%3 === 1 ? 'Company Secretary' : 'Chief Executive Officer')}, effective ${date.toLocaleDateString('en-CA')}.</p>`;
                break;
            case "Mergers/Acquisitions":
                 headline = `${company.name} announces potential acquisition of TargetCorp.`;
                 summary = `<p>${company.name} is in advanced talks to acquire TargetCorp, a player in the [related] industry. This move aims to [strategic goal]. The deal is valued at approximately INR ${(i%200)+50} Cr.</p>`;
                 break;
            case "Expansion":
                 headline = `${company.name} to expand operations in [New City/Region].`;
                 summary = `<p>${company.name} has unveiled plans to expand its operations by setting up a new facility in [New City/Region]. This expansion is expected to create ${ (i%500)+50} new jobs and increase production capacity by ${(i%20)+5} %.</p>`;
                 break;
            default:
                headline = `${category} announcement from ${company.name}.`;
                summary = `<p>${company.name} has made an announcement regarding ${category}. This update pertains to [brief generic detail about the category's typical content, e.g., 'a recent corporate action', 'a regulatory filing', 'a strategic update']. Investors are advised to review the full disclosure available on the exchange website.</p>`;
        }
        if (sentiment === Sentiment.Positive && !headline.toLowerCase().includes('positive')) headline = `Positive Development: ${headline}`;
        if (sentiment === Sentiment.Negative && !headline.toLowerCase().includes('caution')) headline = `Market Alert: ${headline}`;
        
        newItems.push({
            id: `newAnn${i}`,
            company: company,
            category: category,
            headline: headline,
            sentiment: sentiment,
            date: isoDate,
            aiSummary: summary,
        });
    }
    return newItems;
};

const generatedAnnouncements = generateNewAnnouncements(94); // For newAnn1 to newAnn94


export const rawMockAnnouncements: AnnouncementItem[] = [
  { id: 'ann1', company: mockCompanies.find(c=>c.id==='7')!, category: 'Investor/Analyst Meet', headline: 'Investor/Analyst Meet update from Indo Farm Equipment Ltd', sentiment: Sentiment.Neutral, date: '2025-06-07T09:30:00Z', aiSummary: '<p>Indo Farm Equipment Ltd. announced an upcoming investor and analyst meet scheduled for next week. Key topics will include Q2 performance review and future growth strategies for their tractor and agricultural machinery segments.</p><ul><li>Performance Review</li><li>Growth Strategies</li></ul>'},
  { id: 'ann2', company: mockCompanies.find(c=>c.id==='8')!, category: 'Fundraise - Rights Issue', headline: 'Fundraise - Rights Issue update from Lupin Ltd', sentiment: Sentiment.Positive, date: '2025-06-07T10:15:00Z', aiSummary: '<p>Lupin Ltd. has successfully completed its rights issue, raising significant capital for R&D and debt reduction. The issue was oversubscribed, indicating strong investor confidence.</p>' },
  { id: 'ann7', company: mockCompanies.find(c=>c.id==='13')!, category: 'Increase in Share Capital', headline: 'Increase in Share Capital update from Mid East Portfolio Management Ltd', sentiment: Sentiment.Positive, date: '2025-06-07T14:00:00Z', aiSummary: '<p>Mid East Portfolio Management Ltd. announced an increase in its authorized share capital to support future acquisitions and organic growth opportunities.</p>' },
  kirloskarAnnouncement,
  { id: 'ann3', company: mockCompanies.find(c=>c.id==='9')!, category: 'Regulatory Approvals/Orders', headline: 'Regulatory Approvals/Orders update from RattanIndia Power Ltd', sentiment: Sentiment.Positive, date: '2025-06-07T11:00:00Z', aiSummary: '<p>RattanIndia Power Ltd. received a crucial regulatory approval for its new power project. This clearance paves the way for the project\'s commissioning in the next quarter.</p>' },
  { id: 'ann4', company: mockCompanies.find(c=>c.id==='10')!, category: 'Change in KMP', headline: 'Change in KMP update from Royal India Corporation Ltd', sentiment: Sentiment.Neutral, date: '2025-06-07T11:45:00Z', aiSummary: '<p>Royal India Corporation Ltd. announced a change in Key Managerial Personnel. Mr. John Doe has been appointed as the new Chief Financial Officer, effective immediately.</p>' },
  { id: 'ann5', company: mockCompanies.find(c=>c.id==='11')!, category: 'Annual Report', headline: 'Annual Report update from Rossari Biotech Ltd', sentiment: Sentiment.Neutral, date: '2025-06-07T12:30:00Z', aiSummary: '<p>Rossari Biotech Ltd. released its Annual Report for FY2024-25, detailing financial performance and strategic initiatives. The report highlights double-digit growth in specialty chemicals.</p><table><thead><tr><th>Metric</th><th>Value</th></tr></thead><tbody><tr><td>Revenue Growth</td><td>15%</td></tr><tr><td>Net Profit Margin</td><td>12%</td></tr></tbody></table>' },
  { id: 'ann6', company: mockCompanies.find(c=>c.id==='12')!, category: 'Investor Presentation', headline: 'Investor Presentation update from Knowledge Marine & Engineering Works Ltd', sentiment: Sentiment.Positive, date: '2025-06-07T13:15:00Z', aiSummary: '<p>Knowledge Marine & Engineering Works Ltd. published a new investor presentation outlining its strong order book and expansion into new international markets.</p><img src="https://via.placeholder.com/300x150.png?text=Growth+Chart" alt="Growth Chart"/>' },
  { id: 'ann8', company: mockCompanies.find(c=>c.id==='14')!, category: 'Annual Report', headline: 'Annual Report update from ICICI Lombard General Insurance Company Ltd', sentiment: Sentiment.Neutral, date: '2025-06-07T14:45:00Z', aiSummary: '<p>ICICI Lombard General Insurance Company Ltd. released its comprehensive annual report, detailing market share gains and digital transformation efforts.</p>' },
  { id: 'ann9', company: mockCompanies.find(c=>c.id==='15')!, category: 'Annual Report', headline: 'Annual Report update from Alkyl Amines Chemicals Ltd', sentiment: Sentiment.Neutral, date: '2025-06-07T15:30:00Z', aiSummary: '<p>Alkyl Amines Chemicals Ltd. published its annual report, focusing on sustainable practices and capacity expansion in its core amine products.</p>' },
  { id: 'ann10', company: mockCompanies.find(c=>c.id==='1')!, category: 'Financial Results', headline: 'Q1 Results Beat Estimates, Strong Growth in Retail', sentiment: Sentiment.Positive, date: '2025-05-20T09:00:00Z', aiSummary: '<p>Reliance Industries Ltd. reported Q1 financial results that surpassed analyst expectations, driven by robust performance in its retail and telecom divisions.</p>' },
  { id: 'ann11', company: mockCompanies.find(c=>c.id==='16')!, category: 'Procedural/Administrative', headline: 'Procedural/Administrative update from AMS Polymers Ltd', sentiment: Sentiment.Neutral, date: '2025-06-25T10:00:00Z', aiSummary: '<p>AMS Polymers Ltd. provided a procedural update regarding its upcoming shareholder meeting and e-voting process.</p>' },
  {
      id: 'newAnn0',
      company: mockCompanies.find(c => c.ticker === 'HDFCBANK')!,
      category: 'Litigation & Notices',
      headline: "HDFC Bank Disputes Mehta Family's Lawsuit Regarding INR 65.22 Crore Loan Debt from Splendour Gems: The bank asserts that the legal action is baseless and aims to hinder debt recovery efforts.",
      sentiment: Sentiment.Negative,
      date: '2024-08-12T09:00:00Z',
      aiSummary: "<p>HDFC Bank Ltd. is currently disputing a lawsuit filed by the Mehta family concerning a loan debt amounting to INR 65.22 crore, originally associated with Splendour Gems. The bank maintains that the legal action initiated by the Mehta family is without merit and is primarily an attempt to obstruct the bank's legitimate efforts to recover the outstanding debt. Further details on the case are expected as court proceedings continue.</p>",
  },
  ...generatedAnnouncements,
];

export const rawMockMarketResults: MarketResultItem[] = [
  { id: 'mr1', company: mockCompanies.find(c=>c.id==='1')!, aiHeadline: 'Strong Q1 Performance by Reliance Industries Ltd', revenue: '₹1000 Cr', netProfit: '₹100 Cr', eps: '₹10', date: '2025-07-05' },
  { id: 'mr2', company: mockCompanies.find(c=>c.id==='2')!, aiHeadline: 'Strong Q2 Performance by Tata Consultancy Services Ltd', revenue: '₹1200 Cr', netProfit: '₹120 Cr', eps: '₹10.5', date: '2025-06-02' },
  { id: 'mr3', company: mockCompanies.find(c=>c.id==='3')!, aiHeadline: 'Strong Q3 Performance by HDFC Bank Ltd', revenue: '₹1400 Cr', netProfit: '₹140 Cr', eps: '₹11', date: '2025-05-28' },
  { id: 'mr4', company: mockCompanies.find(c=>c.id==='4')!, aiHeadline: 'Strong Q4 Performance by Infosys Ltd', revenue: '₹1600 Cr', netProfit: '₹160 Cr', eps: '₹11.5', date: '2025-05-23' },
  { id: 'mr5', company: mockCompanies.find(c=>c.id==='5')!, aiHeadline: 'Strong Q5 Performance by ICICI Bank Ltd', revenue: '₹1800 Cr', netProfit: '₹180 Cr', eps: '₹12', date: '2025-05-18' },
  { id: 'mr6', company: mockCompanies.find(c=>c.id==='6')!, aiHeadline: 'Strong Q6 Performance by New India Assurance Company Ltd', revenue: '₹2000 Cr', netProfit: '₹200 Cr', eps: '₹12.5', date: '2025-05-13' },
  { id: 'mr7', company: mockCompanies.find(c=>c.id==='7')!, aiHeadline: 'Strong Q7 Performance by Indo Farm Equipment Ltd', revenue: '₹2200 Cr', netProfit: '₹220 Cr', eps: '₹13', date: '2025-05-08' },
];


export const mockSavedItems: SavedItem[] = [
    { 
        id: 'ann1', 
        type: 'announcement', 
        content: rawMockAnnouncements.find(ann => ann.id === 'ann1')!, 
        notes: 'Crucial meet. Follow up on growth strategies.', 
        eventDate: rawMockAnnouncements.find(ann => ann.id === 'ann1')!.date,
        priceChangeSinceEvent: '+1.5%',
        noteSavedDate: '2025-06-10T10:00:00Z',
        priceChangeSinceNoteSaved: '+0.8%' 
    },
    { 
        id: 'mr1', 
        type: 'market_data', 
        content: rawMockMarketResults.find(mr => mr.id === 'mr1')!, 
        notes: 'Keep an eye on next quarter results. Debt levels?', 
        eventDate: rawMockMarketResults.find(mr => mr.id === 'mr1')!.date,
        priceChangeSinceEvent: '-0.5%',
        noteSavedDate: '2025-07-10T11:00:00Z',
        priceChangeSinceNoteSaved: '-0.2%'
    },
    {
        id: 'ann7', 
        type: 'announcement',
        content: rawMockAnnouncements.find(ann => ann.id === 'ann7')!,
        notes: 'Potential for acquisitions is high.',
        eventDate: rawMockAnnouncements.find(ann => ann.id === 'ann7')!.date,
        priceChangeSinceEvent: '+3.2%',
        noteSavedDate: '2025-06-08T15:00:00Z',
        priceChangeSinceNoteSaved: '+1.1%'
    },
];

rawMockAnnouncements.forEach(ann => {
    const savedVersion = mockSavedItems.find(si => si.id === ann.id && si.type === 'announcement');
    if (savedVersion) {
        ann.isSaved = true;
        ann.notes = savedVersion.notes;
    } else {
        ann.isSaved = false;
        ann.notes = undefined;
    }
});

rawMockMarketResults.forEach(mr => {
    const savedVersion = mockSavedItems.find(si => si.id === mr.id && si.type === 'market_data');
    if (savedVersion) {
        mr.isSaved = true;
        mr.notes = savedVersion.notes;
    } else {
        mr.isSaved = false;
        mr.notes = undefined;
    }
});


export const mockAnnouncements: AnnouncementItem[] = [...rawMockAnnouncements];
export const mockMarketResults: MarketResultItem[] = [...rawMockMarketResults];


export const mockSmartMoneyActivities: SmartMoneyActivity[] = [
    { id: 'sm1', investorName: 'Ashish Kacholia', activity: 'Increased stake in Alkyl Amines Chemicals Ltd by 2%.', date: '2025-06-15' },
    { id: 'sm2', investorName: 'Rakesh Jhunjhunwala Estate', activity: 'New entry in HDFC Bank Ltd with 1.5M shares.', date: '2025-06-10' },
    { id: 'sm3', investorName: 'Vijay Kedia', activity: 'Mentioned potential in Indo Farm Equipment Ltd during an interview.', date: '2025-06-05' },
];

export const mockCorporateActions: CorporateAction[] = [
    { id: 'ca1', companyName: 'Alkyl Amines Chemicals Ltd', actionType: 'Dividend', details: 'Interim dividend of ₹5 per share', date: '2025-07-10' },
    { id: 'ca2', companyName: 'Reliance Industries Ltd', actionType: 'AGM', details: 'Annual General Meeting', date: '2025-08-01' },
];

export const mockKeyDocuments: KeyDocument[] = [
    { id: 'kd1', companyName: 'Alkyl Amines Chemicals Ltd', documentType: 'Annual Report', title: 'Annual Report FY2024-25', date: '2025-06-20', url: '#' },
    { id: 'kd2', companyName: 'AMS Polymers Ltd', documentType: 'Investor Presentation', title: 'Q1 FY26 Investor Presentation', date: '2025-07-05', url: '#' },
];
