import { boulevardGraphql } from "@/lib/boulevard/client";

const BUSINESS_QUERY = `
  query BoulevardBusiness {
    business {
      id
      name
    }
  }
`;

interface BoulevardBusinessResponse {
  business: {
    id: string;
    name: string;
  };
}

export interface BoulevardBusiness {
  id: string;
  name: string;
}

export async function fetchBoulevardBusiness(): Promise<BoulevardBusiness> {
  const data = await boulevardGraphql<BoulevardBusinessResponse>(BUSINESS_QUERY);
  return data.business;
}
