// TODO see caching and add domain name to db
export const DOMAIN_CONFIG = {
  "www.hive-family.com": "fa014162-757e-45b0-a46a-2335c06c09c1",
  "www.kempwestent.com": "7380adac-fd46-4daa-a8bf-f5bde81bf67f",
  "www.urbanspotlight.eu": "a01d4e13-8168-4f4e-9ad6-342acc9e167d",
  "www.eventrave.com": "b01d4e13-8168-4f4e-9ad6-342acc9e167b",
  "www.naslqpo.com": "fb0c634b-eb4d-4880-8321-a1dece7944ea",
  "www.murmurlive.eu": "49490378-3860-4a63-b2b0-845af1235487",
  localhost: "fa014162-757e-45b0-a46a-2335c06c09c0", // "8914a26d-c7b9-4aba-8783-fcafa0eb93c7",
  "192.168.1.12": "a01d4e13-8168-4f4e-9ad6-342acc9e167d", // "8914a26d-
};

export const getDomainFromOrgId = (orgId: string) => {
  return Object.entries(DOMAIN_CONFIG).find(([, id]) => id === orgId)?.[0];
};

// test fa014162-757e-45b0-a46a-2335c06c09c0
