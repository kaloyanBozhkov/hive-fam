// TODO see caching and add domain name to db
export const DOMAIN_CONFIG = {
  "hive-family.com": "fa014162-757e-45b0-a46a-2335c06c09c1",
  "kempwestent.com": "7380adac-fd46-4daa-a8bf-f5bde81bf67f",
  "urbanspotlight.eu": "a01d4e13-8168-4f4e-9ad6-342acc9e167d",
  "eventrave.com": "b01d4e13-8168-4f4e-9ad6-342acc9e167b",
  "naslqpo.com": "fb0c634b-eb4d-4880-8321-a1dece7944ea",
  "murmurlive.eu": "49490378-3860-4a63-b2b0-845af1235487",
  "znp.show": "8b72337a-3532-4098-b474-444c14743d61",
  localhost: "fb0c634b-eb4d-4880-8321-a1dece7944ea", // "8914a26d-c7b9-4aba-8783-fcafa0eb93c7",
  "192.168.1.12": "fa014162-757e-45b0-a46a-2335c06c09c1",
};

export const getDomainFromOrgId = (orgId: string) => {
  return Object.entries(DOMAIN_CONFIG).find(([, id]) => id === orgId)?.[0];
};

// test fa014162-757e-45b0-a46a-2335c06c09c0
