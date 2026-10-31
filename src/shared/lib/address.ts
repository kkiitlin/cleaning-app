export function formatAddress(params: {
  street: string;
  entrance: string;
  apartment: string;
}): string {
  const { street, entrance, apartment } = params;
  const trimmedStreet = street.trim();
  const trimmedEntrance = entrance.trim();
  const trimmedApartment = apartment.trim();

  let address = trimmedStreet;

  if (!trimmedStreet.startsWith('г. ')) {
    address = 'г. Минск, ' + trimmedStreet;
  }

  const parts: string[] = [];
  if (trimmedEntrance) {
    parts.push(`п. ${trimmedEntrance}`);
  }
  if (trimmedApartment) {
    parts.push(`кв. ${trimmedApartment}`);
  }

  if (parts.length > 0) {
    address += ', ' + parts.join(', ');
  }

  return address;
}
