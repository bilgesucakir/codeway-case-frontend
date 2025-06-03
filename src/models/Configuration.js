export default class Configuration {
  constructor({ id, parameterKey, value, description, createdAt, lastUpdated }) {
    this.id = id;
    this.parameterKey = parameterKey;
    this.value = value;
    this.description = description;
    this.createdAt = this.parseDate(createdAt);
    this.lastUpdated = this.parseDate(lastUpdated);
  }

  parseDate(timestamp) {
    if (!timestamp) return null;
    if (timestamp instanceof Date) return timestamp;
    if (typeof timestamp._seconds === 'number') {
      return new Date(timestamp._seconds * 1000 + (timestamp._nanoseconds ? timestamp._nanoseconds / 1e6 : 0));
    }
    const parsed = new Date(timestamp);
    return isNaN(parsed) ? null : parsed;
  }

  get formattedCreatedAt() {
    return this.createdAt ? this.createdAt.toLocaleString() : '-';
  }

  get formattedLastUpdated() {
    return this.lastUpdated ? this.lastUpdated.toLocaleString() : '-';
  }
}
