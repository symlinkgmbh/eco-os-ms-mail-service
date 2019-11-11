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



import { MsMail, MsConf, PkCore } from "@symlinkde/eco-os-pk-models";
import { Templates } from "../../infrastructure/mail/TemplateEnum";
import { CustomRestError, apiResponseCodes } from "@symlinkde/eco-os-pk-api";
import fs from "fs-extra";
import path from "path";
import { MailService } from "../../infrastructure/mail/MailService";
import { IMailOptions } from "../../infrastructure/mail/IMailOptions";
import mustache from "mustache";
import { IMailTransport } from "../../infrastructure/mail/IMailTransport";
import { serviceContainer, ECO_OS_PK_CORE_TYPES } from "@symlinkde/eco-os-pk-core";

export class MailController {
  public static instance: MailController;

  public static getInstance(): MailController {
    if (!MailController.instance) {
      MailController.instance = new MailController();
    }

    return MailController.instance;
  }

  private confClient: PkCore.IEcoConfigClient;
  private mailService: MailService;

  private constructor() {
    this.mailService = new MailService();
    this.confClient = serviceContainer.get<PkCore.IEcoConfigClient>(ECO_OS_PK_CORE_TYPES.IEcoConfigClient);
  }

  public async sendAccountLockedMail(mail: MsMail.IMailAccountLocked): Promise<void> {
    const tpl = await this.resolveMailTemplate(Templates.accountLocked, mail);
    const config = await this.getMailConfig();
    const mailOpt: IMailOptions = {
      from: config.sender,
      subject: "We have locked your account",
      html: tpl.toString(),
      to: mail.to,
    };

    await this.mailService.sendMail(mailOpt);
  }

  public async sendActivateAccountMail(mail: MsMail.IMailActivateAccount): Promise<any> {
    const tpl = await this.resolveMailTemplate(Templates.activateAccount, mail);
    const config = await this.getMailConfig();
    const mailOpt: IMailOptions = {
      from: config.sender,
      subject: "Please activate your account",
      html: tpl.toString(),
      to: mail.to,
    };

    return await this.mailService.sendMail(mailOpt);
  }

  public async sendAccountDeleteMail(mail: MsMail.IMailDeleteAccount): Promise<any> {
    const tpl = await this.resolveMailTemplate(Templates.accountDelete, mail);
    const config = await this.getMailConfig();
    const mailOpt: IMailOptions = {
      from: config.sender,
      subject: "Please confirm account delete",
      html: tpl.toString(),
      to: mail.to,
    };

    return await this.mailService.sendMail(mailOpt);
  }

  public async sendResetPasswordMail(mail: MsMail.IMailResetPassword): Promise<any> {
    const tpl = await this.resolveMailTemplate(Templates.resetPassword, mail);
    const config = await this.getMailConfig();
    const mailOpt: IMailOptions = {
      from: config.sender,
      subject: "Please change your password",
      html: tpl.toString(),
      to: mail.to,
    };

    return await this.mailService.sendMail(mailOpt);
  }

  public async sendChangePasswordMail(mail: MsMail.IMailResetPassword): Promise<any> {
    const tpl = await this.resolveMailTemplate(Templates.changePassword, mail);
    const config = await this.getMailConfig();
    const mailOpt: IMailOptions = {
      from: config.sender,
      subject: "Please change your password",
      html: tpl.toString(),
      to: mail.to,
    };

    return await this.mailService.sendMail(mailOpt);
  }

  public async sendFederationFailMail(mail: MsMail.IMailFederationFailed): Promise<any> {
    const tpl = await this.resolveMailTemplate(Templates.federationFailed, mail);
    const config = await this.getMailConfig();
    const mailOpt: IMailOptions = {
      from: config.sender,
      subject: "Federation failed",
      html: tpl.toString(),
      to: mail.to,
    };

    return await this.mailService.sendMail(mailOpt);
  }

  private async resolveMailTemplate(template: string, props: any): Promise<string> {
    try {
      const tpl = await fs.readFile(path.join(process.cwd(), "lib/infrastructure/templates/" + template));
      const renderedTpl = mustache.render(tpl.toString(), props);
      return renderedTpl;
    } catch (err) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C824.code,
          message: apiResponseCodes.C824.message,
        },
        500,
      );
    }
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
