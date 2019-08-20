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

import { IMailTransport } from "./IMailTransport";
import { MsConf, PkCore } from "@symlinkde/eco-os-pk-models";
import * as NodeMailer from "nodemailer";
import { serviceContainer, ECO_OS_PK_CORE_TYPES } from "@symlinkde/eco-os-pk-core";

export abstract class AbstractMailService {
  private confClient: PkCore.IEcoConfigClient;

  constructor() {
    this.confClient = serviceContainer.get<PkCore.IEcoConfigClient>(ECO_OS_PK_CORE_TYPES.IEcoConfigClient);
  }

  public async getTransporter(): Promise<NodeMailer.Transporter> {
    return await this.createTransporter();
  }

  private async createTransporter(): Promise<NodeMailer.Transporter> {
    const config = await this.getMailConfig();
    const mailer = await NodeMailer.createTransport(config);
    return mailer;
  }

  private async getMailConfig(): Promise<IMailTransport> {
    const loadConf = await this.confClient.get("mail");
    const mailConfObj: MsConf.IMailConfig = <MsConf.IMailConfig>Object(loadConf.data.mail);
    const conf = <IMailTransport>{
      host: mailConfObj.host,
      port: mailConfObj.port,
      secure: mailConfObj.secure,
      auth: {
        user: mailConfObj.email,
        pass: mailConfObj.password,
      },
      sender: mailConfObj.senderName,
    };
    return conf;
  }
}
