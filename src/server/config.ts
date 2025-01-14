// TODO see caching and add domain name to db
export const DOMAIN_CONFIG = {
  "www.hive-family.com": "fa014162-757e-45b0-a46a-2335c06c09c0",
  "www.kempwestent.com": "7380adac-fd46-4daa-a8bf-f5bde81bf67f",
  localhost: "fa014162-757e-45b0-a46a-2335c06c09c0",
  "192.168.1.100": "7380adac-fd46-4daa-a8bf-f5bde81bf67f",
};

export const getDomainFromOrgId = (orgId: string) => {
  return Object.entries(DOMAIN_CONFIG).find(([, id]) => id === orgId)?.[0];
};
