export interface IShippingOption {
  name: string;
  price: number;
  estimatedDays: number;
  isFree: boolean;
}

export async function calculateShipping(
  cep: string,
  subtotal: number,
  freeShippingThreshold: number = 299.0
): Promise<{ address?: any; options: IShippingOption[] }> {
  const cleanCep = cep.replace(/\D/g, '');

  let addressData: any = null;
  if (cleanCep.length === 8) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      if (response.ok) {
        const json: any = await response.json();
        if (!json.erro) {
          addressData = {
            street: json.logradouro,
            neighborhood: json.bairro,
            city: json.localidade,
            state: json.uf,
          };
        }
      }
    } catch {
      // Caso não consiga consultar online, continua com cálculo de prazo
    }
  }

  const isFree = subtotal >= freeShippingThreshold;

  const options: IShippingOption[] = [
    {
      name: 'Entrega Padrão (Econômica)',
      price: isFree ? 0 : 19.9,
      estimatedDays: 5,
      isFree,
    },
    {
      name: 'PAC Correios',
      price: isFree ? 0 : 24.9,
      estimatedDays: 4,
      isFree,
    },
    {
      name: 'SEDEX Expresso',
      price: isFree ? 12.9 : 34.9,
      estimatedDays: 2,
      isFree: false,
    },
  ];

  return {
    address: addressData,
    options,
  };
}
