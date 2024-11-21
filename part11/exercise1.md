# CI Setup for a Python 

*Some common steps in a CI setup include linting, testing, and building. What are the specific tools for taking care of these steps in the ecosystem of the language you picked?*

- **Linting**: Pylint, flake8, mypy offered from Microsoft or Ruff, mypy from the community.
- **Testing**: Pytest, Behave, Lettuce and many other frameworks.
- **Build**: Pybuilder, it is a build automation tool.

*What alternatives are there to set up the CI besides Jenkins and GitHub Actions? Again, you can ask Google!*

Besides Jenkins and GitHub Actions, there are also Spacelift, GitLab CI, Travis CI, CircleCI or Azure DevOps.

*Would this setup be better in a self-hosted or a cloud-based environment? Why? What information would you need to make that decision?*

If we use Azure DevOps or CircleCI, this setup would be better in a cloud-based environment since this requires a cloud infrastructure.
