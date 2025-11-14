import { Slash } from 'lucide-react';
import { InvitesDropdown } from './invites-dropdown';
import { Logo } from './logo';
import OrganizationSwitch from './organization-switch';
import { ProfileDropwdown } from './profile-dropdown';

export const Header = () => {
    return (
        <header className="p-6 pb-3 bg-muted/20 ">
            <div className="mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Logo to="/dashboard" />
                    <Slash className="size-5 -rotate-20 text-border" />
                    <OrganizationSwitch />
                </div>
                <div className="flex items-center gap-2">
                    <InvitesDropdown />
                    <Slash className="size-5 -rotate-45 text-border" />
                    <ProfileDropwdown />
                </div>
            </div>
        </header>
    );
};
