export const INPUT_COORD = 'INPUT_COORD';
export const INPUT_ADDRESS = 'INPUT_ADDRESS';

export function inputAddress(address) {
  return {
    type: INPUT_ADDRESS,
    address
  };
}

export function inputData(data) {
  return {
    type: INPUT_COORD,
    data
  };
}
