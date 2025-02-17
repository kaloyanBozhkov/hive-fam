// TODO see caching and add domain name to db
export const DOMAIN_CONFIG = {
  "www.hive-family.com": "fa014162-757e-45b0-a46a-2335c06c09c0",
  "www.kempwestent.com": "7380adac-fd46-4daa-a8bf-f5bde81bf67f",
  "www.urbanspotlight.eu": "a01d4e13-8168-4f4e-9ad6-342acc9e167d",
  "www.eventrave.com": "b01d4e13-8168-4f4e-9ad6-342acc9e167b",
  localhost: "8914a26d-c7b9-4aba-8783-fcafa0eb93c7",
  "192.168.1.100": "7380adac-fd46-4daa-a8bf-f5bde81bf67f",
};

export const getDomainFromOrgId = (orgId: string) => {
  return Object.entries(DOMAIN_CONFIG).find(([, id]) => id === orgId)?.[0];
};
