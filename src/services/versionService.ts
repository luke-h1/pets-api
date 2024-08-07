export default class VersionService {
  getVersion() {
    return {
      deployedBy: process.env.DEPLOYED_BY,
      deployedAt: process.env.DEPLOYED_AT,
    };
  }
}
