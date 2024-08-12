import { Request } from 'express';
import xml from 'xml';

export default class VersionService {
  getVersion(req: Request) {
    if (req.accepts('xml')) {
      const res = xml({
        version: [
          { deployedBy: process.env.DEPLOYED_BY },
          { deployedAt: process.env.DEPLOYED_AT },
        ],
        _attr: { version: '1.0' },
        _cdata: 'version information',
      });
      return res;
    }

    return {
      deployedBy: process.env.DEPLOYED_BY,
      deployedAt: process.env.DEPLOYED_AT,
    };
  }
}
