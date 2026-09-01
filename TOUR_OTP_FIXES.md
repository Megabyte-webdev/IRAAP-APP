# Tour + OTP fixes

- Mobile tour now includes a real highlighted `data-tour="mobile-menu"` step.
- The menu step is followed by opening the sidebar and highlighting every rendered navigation item.
- Desktop retains the full-sidebar `Your workspace` step before navigating through all role-visible items.
- Next/Back navigation is centralized to avoid duplicate or competing async callbacks.
- Mobile sidebar is opened/closed only when needed for a target.
- Resize refreshes the current Driver.js tour instead of rebuilding it.
- Tour completion is persisted only when the user finishes or skips.
- OTP page now installs a `beforeunload` guard while an active, unexpired challenge exists and verification is not in progress.
- OTP challenge and countdown remain persisted in localStorage, so a browser refresh can recover state if navigation still occurs.
