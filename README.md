# Polyglot-Persistence-Demo

## How to run testing sequence

- Open Docker Desktop
- Open DBeaver
- Open MongoDB Compass
- Open Bash
- Start up containers `docker compose up -d`
- Run qa tests `npx jest tests/qa-framework.test.ts --verbose`
- Run runner code and view databases `npx ts-node tests/runner.ts`

## AI (Gemini Pro) Prompts

I used the sample code with little changes.
I received a mostly good response. The issues were not over efficiencies or deficiencies in the database code, but were rather a slew of small syntax errors and issues around package versioning.
Many of the packages did not work well together at their latest version and had to be reinstalled with an earlier version.

I also had issues around the tests. The AI did not include fallbacks to make sure that all of the tests wouldn't fail on empty or non-existing databases.