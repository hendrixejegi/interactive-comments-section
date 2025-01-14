export function generateUniqueId() {
  const timestamp = Date.now(); // Current timestamp in milliseconds
  const randomNum = Math.floor(Math.random() * 1000000); // Random number between 0 and 999999
  return `${timestamp}-${randomNum}`;
}