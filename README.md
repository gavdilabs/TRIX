<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#requirements">Requirements</a></li>
        <li><a href="#deployment">Deployment</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>


## About The Project

**TRIX** - _Time Registration Improvement eXperience_ - is designed to be a lightweight solution for capturing and managing Time Registration in response to the many heavy and cumbersome solutions out there.
It is designed with a minimal core around two types registration:
* _Timesheet_ - Enter Daily, Weekly or Monthly Sheet with Hours
* _Timerecorder_ - Capture Realtime Hours spent

On top of there are features to handle the process of Approval of hours and the all important option of adding Integrations to other systems, allowing third party systems to receive the registered and approved hours.
The solution includes a lot of useful features in the Core Version, including:
1. Setting up your Profile, including Expected Work Hours
2. Manager Approval/Rejection of Hours for Direct Reports
3. Full Configuration of Categories and Time Registration Types
4. Configuration of Approval Flow
5. Built-In Validations

### Built With

The solution is built on top of SAP Frameworks, including

* [UI5](https://openui5.org)
* [CAP](https://cap.cloud.sap/)

Utilizing SAP Business Technology Platform, PostgreSQL, TypeScript and a lot of other technologies.

## Getting Started

Verify that you have the Requirements for the Solution in place and then you can clone and deploy it, following the description

### Requirements

The solution can be deployed on [SAP Business Technology Platform](https://www.sap.com/products/technology-platform.html), so ensure that you have an Account and on that account you need a Subaccount with the following entitlements:
* [PostgreSQL on SAP BTP, hyperscaler option](https://discovery-center.cloud.sap/serviceCatalog/postgresql-hyperscaler-option)
* [SAP BTP, Cloud Foundry Runtime](https://discovery-center.cloud.sap/serviceCatalog/cloud-foundry-runtime)

Sizing these depends on the number of concurrent and total users that are going to be using the solution in that particular Subaccount.

### Deployment

_To deploy the solution once you have cloned it you need to_

1. Ensure all UI modules and services have their dependencies installed.
    You can do this by using the following commands:
    ```shell
    $ cd uimodules/approval && npm install
    $ cd uimodules/reporting && npm install
    $ cd uimodules/recording && npm install
    $ cd uimodules/timesheet && npm install
    $ cd services/core-service && npm install
    $ cd services/admin-service && npm install
    ```
2. Once dependencies are install, from the root run the command
   ```sh
   npm run build
   ```
3. Then from here, login to your BTP Cloud Foundry subaccount of choice and then run the command:
   ```sh
   npm run deploy
   ```
4.  From here login to your BTP subaccount and ensure that the roles for the solution are assigned to the appropriate role collections in your setup.

Be sure to verify the solution before opening it up to your users by checking:

- [x] User present in SAP Business Technology Platform IDP
- [x] Correct Role Assignment
- [ ] Language Support (more languages can be added via the i18n files)
- [ ] Solution Deployed and Tested
    - [X] Development/Test Subaccount
    - [ ] Production Subaccount

## Roadmap

There is still a lot of baseline features planned for the Core Solution, but the main focus is on adding Integrations into other solutions, as Hours from Time Registrations are typically needed in other contexts.

The next release will add one or more Integrations, also showcasing how other Loosely Coupled Integrations can be added and active at the same time with the chosen Event-Driven Architecture.

The main features planned are:
- Default Time Registration from Favorite/Starred Week
- Time Recorder
- Appoint Substitute
- Automated Testing using WDI5
- Reporting
  - For Employee
  - For Manager
  - For Audit
- Integrations
  - To SAP CATS on SAP ECC
  - To SAP CATS on SAP S/4HANA (Public Cloud Edition and Private Managed)
  - To SAP SuccessFactors Time Mgt.
  - From Outlook
- A "Jump To Date" button, allowing the user to jump to any random week

Plus fixes - See the [open issues](https://github.com/gavdilabs/trix/issues) for a full list of proposed features (and known issues).

## Contributing

Any contributions to the project are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request and do your changes by following our required procedure (allowing us to manage the incoming work):
1. Bring your idea to a fix or a feature, or find one in the Issue Tracker!
2. Fork the repository and Create your Feature Branch, name it feature|fix-name of fix or feature with spaces as underscore-month-year - e.g. feature-de_translation-02-2025 or fix-injection_issue_data_loader-08-2024. Notice: If you are implementing a fix from the issue tracker use the issue number as the name, prefixed by #, e.g. fix-#6403-10-2024
3. Implement your changes, ensuring that you keep the code, methods and comments short and to the point
4. Add and Update Unit Test (your code will not be approved without these)
5. Make sure that you clearly state what you are committing in your commit message (and rather commit often with clear messages than committing a large, complex mess)
6. Once you implemented the changes, tested the code, it quality and speed and verified that all unit tests are green do a Pull Request, where you title the Pull Request the Feature/Fix you implemented
7. Make requested changes if asked by the reviewer
8. Receive a huge thanks and eternal appreciation from the team when your contribution is merged (we might even throw in a trophy for best contribution down the line)!

Rules that needs to be respected:
- Don't include code or dependencies that violates or breaks either the code's licenses or the provided license of this solution
- Don't try to change the underlying foundation, infrastructure or base functionality of the solution without discussing and getting approval from the maintainers beforehand
- Stay constructive in feedback, contribution and collaboration!

### Coordination

All Issues and Feature Requests are done using the Issue Tracker on GitHub, so be sure to check there first. All Prioritization is done by the Core Team to ensure a strong focus on the core solution and its focus.
All Communication and coordination is done via Discord on https://discord.com/channels/1217814600205205504/1217814718077603861 .

## License

Distributed under the Apache-2 License
