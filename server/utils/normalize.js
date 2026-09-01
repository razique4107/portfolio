export function normalizeEmail(email) {
  if (!email) return null;
  return email.toLowerCase().trim();
}

export function normalizeDisplayName(name) {
  if (!name) return null;
  return name.trim();
}

export function truncateUserAgent(userAgent) {
  if (!userAgent) return null;
  // Extract browser and OS info, max 256 chars
  const match = userAgent.match(/([^/]+\/[^;\s]+).*(Windows|Mac|Linux|Android|iPhone)/);
  if (match) {
    return (match[0] || '').substring(0, 256);
  }
  return userAgent.substring(0, 256);
}

export function hashIp(ip) {
  if (!ip) return null;
  // Hash the IP for privacy, keep last octet visible for debugging
  const parts = ip.split('.');
  if (parts.length === 4) {
    return `[hashed].${parts[3]}`;
  }
  return '[hashed]';
}
