import Ticket from "@/islands/peices/ticket.tsx";

export default function ViewTicket() {
  const ticket = `${crypto.randomUUID()}_${crypto.randomUUID()}_${crypto.randomUUID()}`;

  return (
    <>
      <Ticket
        id={ticket}
        tickets={1}
        showTime={{
          id: crypto.randomUUID(),
          maxTickets: 1,
          multiPurchase: false,
          soldTickets: 69420,
          startDate: new Date().toString(),
        }}
      />
    </>
  );
}

// Input UUID
const uuid = '550e8400-e29b-41d4-a716-446655440000_550e8400-e29b-41d4-a716-446655440000';

// Convert UUID to hexadecimal string
const hexString = uuid.replace(/-/g, '');

// Convert the hexadecimal string to binary data
const binaryData = new Uint8Array(hexString.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));

// Convert the binary data to base64
// @ts-expect-error type
const base64Data = btoa(String.fromCharCode.apply(null, binaryData));

console.log('Input UUID:', uuid);
console.log('Output minified:', base64Data);

// Decode the base64-encoded string to binary data
const decodedData = new Uint8Array(
  atob(base64Data)
    .split('')
    .map((char) => char.charCodeAt(0))
);

// Convert the binary data to a hexadecimal string
const hexData = Array.from(decodedData, (byte) =>
  byte.toString(16).padStart(2, '0')
);

let hexStr = "";

for (const hex of hexData) {
	hexStr += hex;
}

console.log('Output hex:', hexStr);

const decodedUUIDs = [];

for (let i = 0; i < hexStr.length; i += 34) {
	const uuid = hexStr.substring(i, i + 34);

	decodedUUIDs.push(uuid.slice(0, 4) +
  '-' +
  uuid.slice(4, 6) +
  '-' +
  uuid.slice(6, 8) +
  '-' +
  uuid.slice(8, 10) +
  '-' +
  uuid.slice(10));

}

// Format the hexadecimal string into the UUID format
console.log('Decoded:', decodedUUIDs);



