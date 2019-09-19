/**
 * Copyright 2018-2019 Symlink GmbH
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 */



import { AbstractMailService } from "./AbstractMailService";
import { IMailOptions } from "./IMailOptions";

export class MailService extends AbstractMailService {
  constructor() {
    super();
  }

  public async sendMail(obj: IMailOptions): Promise<any> {
    const mailer = await this.getTransporter();
    return await mailer.sendMail(obj);
  }
}
