// API Helper functions for fetching real metrics data

const API_BASE_URL = "http://168.231.80.24:9002/api";

interface DateRange {
  startDate: Date;
  endDate: Date;
}

/**
 * Fetch leads count from backend
 */
export async function fetchLeads(dateRange?: DateRange): Promise<number> {
  try {
    let url = `${API_BASE_URL}/leads`;

    if (dateRange) {
      const startDate = dateRange.startDate.toISOString().split('T')[0];
      const endDate = dateRange.endDate.toISOString().split('T')[0];
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }

    const response = await fetch(url);
    if (!response.ok) return 0;
    const data = await response.json();

    return data.success ? data.totalLeads : 0;
  } catch {
    return 0;
  }
}

/**
 * Fetch calls count from backend
 */
export async function fetchCalls(dateRange?: DateRange): Promise<number> {
  try {
    let url = `${API_BASE_URL}/calls`;

    if (dateRange) {
      const startDate = dateRange.startDate.toISOString().split('T')[0];
      const endDate = dateRange.endDate.toISOString().split('T')[0];
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }

    const response = await fetch(url);
    if (!response.ok) return 0;
    const data = await response.json();

    return data.success ? data.totalCalls : 0;
  } catch {
    return 0;
  }
}

/**
 * Fetch WhatsApp messages count from backend
 */
export async function fetchWhatsAppMessages(dateRange?: DateRange): Promise<number> {
  try {
    let url = `${API_BASE_URL}/whatsapp`;

    if (dateRange) {
      const startDate = dateRange.startDate.toISOString().split('T')[0];
      const endDate = dateRange.endDate.toISOString().split('T')[0];
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }

    const response = await fetch(url);
    if (!response.ok) return 0;
    const data = await response.json();

    return data.success ? data.totalMessages : 0;
  } catch {
    return 0;
  }
}

/**
 * Fetch emails count from backend
 */
export async function fetchEmails(dateRange?: DateRange): Promise<number> {
  try {
    let url = `${API_BASE_URL}/emails`;

    if (dateRange) {
      const startDate = dateRange.startDate.toISOString().split('T')[0];
      const endDate = dateRange.endDate.toISOString().split('T')[0];
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }

    const response = await fetch(url);
    if (!response.ok) return 0;
    const data = await response.json();

    return data.success ? data.totalEmails : 0;
  } catch {
    return 0;
  }
}

/**
 * Fetch users count with date range support
 */
export async function fetchUsers(dateRange?: DateRange): Promise<number> {
  try {
    let url = `${API_BASE_URL}/users`;

    if (dateRange) {
      const startDate = dateRange.startDate.toISOString().split('T')[0];
      const endDate = dateRange.endDate.toISOString().split('T')[0];
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }

    const response = await fetch(url);
    if (!response.ok) return 0;
    const data = await response.json();

    return data.success ? data.totalUsers : 0;
  } catch {
    return 0;
  }
}

/**
 * Fetch total listings count with date range support
 */
export async function fetchListings(dateRange?: DateRange): Promise<number> {
  try {
    let url = `${API_BASE_URL}/total-data-count`;

    if (dateRange) {
      const startDate = dateRange.startDate.toISOString().split('T')[0];
      const endDate = dateRange.endDate.toISOString().split('T')[0];
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }

    const response = await fetch(url);
    if (!response.ok) return 0;
    const data = await response.json();

    return data.success ? data.totalCount : 0;
  } catch {
    return 0;
  }
}

/**
 * Fetch all communication metrics at once
 */
export async function fetchAllCommunicationMetrics(dateRange?: DateRange) {
  const [leads, calls, whatsapp, emails] = await Promise.all([
    fetchLeads(dateRange),
    fetchCalls(dateRange),
    fetchWhatsAppMessages(dateRange),
    fetchEmails(dateRange),
  ]);

  return { leads, calls, whatsapp, emails };
}
