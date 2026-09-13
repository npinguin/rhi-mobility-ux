# GitHub Import — migration/hacs-current

The target public repository already exists:

`npinguin/rhi-mobility-ux`

The migration branch already exists:

`migration/hacs-current`

To import the prepared repository tree from the repository ZIP:

```bash
git clone https://github.com/npinguin/rhi-mobility-ux.git
cd rhi-mobility-ux
git checkout migration/hacs-current

# Extract the prepared repository ZIP into this working tree, replacing the
# bootstrap-only contents. Do not copy node_modules.

git add -A
git commit -m "chore: import Mobility UX HACS migration baseline"
git push origin migration/hacs-current
```

Then wait for `validate.yml` and HACS validation. Do not merge if either is red.

After CI is green, open/inspect the PR from `migration/hacs-current` to `main`. The first release tag must be `v1.0.0-rc.1` and must point to the exact tested merge commit.

Do not create `v1.0.0` stable until HACS install, runtime parity, version selection and rollback have been proven.
