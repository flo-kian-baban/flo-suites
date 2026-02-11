'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Plus,
    Trash2,
    Save,
    Loader2,
    ChevronDown,
    Check,
    ChevronsUpDown,
    Star,
    ImageIcon,
} from 'lucide-react';
import { INDUSTRIES } from '@/data/industries';
import { uploadFile } from '@/lib/storage';
import {
    ClientStatus,
    ClientContact,
    ClientLocation,
    ClientOffer,
    ClientLink,
    ClientFull,
    LinkType,
    ContactType,
    CreateClientPayload,
} from '@/lib/clients';
import { createAdminClient, updateAdminClient } from '@/actions/admin';

// ─── Constants ───────────────────────────────────────────

const STATUS_OPTIONS: { value: ClientStatus; label: string }[] = [
    { value: 'lead', label: 'Lead' },
    { value: 'onboarding', label: 'Onboarding' },
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
    { value: 'offboarded', label: 'Offboarded' },
];

const CONTACT_TYPES: { value: ContactType; label: string }[] = [
    { value: 'decision_maker', label: 'Decision Maker' },
    { value: 'primary', label: 'Primary Contact' },
    { value: 'secondary', label: 'Secondary Contact' },
];

const LINK_TYPES: { value: LinkType; label: string }[] = [
    { value: 'website', label: 'Website' },
    { value: 'booking', label: 'Booking' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'google_business_profile', label: 'Google Business Profile' },
    { value: 'other', label: 'Other' },
];

// ─── Helpers ─────────────────────────────────────────────

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

// ─── Sub-components ──────────────────────────────────────

function SectionTitle({ title, description }: { title: string; description?: string }) {
    return (
        <div className="mb-5">
            <h3 className="text-sm font-bold text-flo-orange/80 uppercase tracking-widest">{title}</h3>
            {description && <p className="text-xs text-white/30 mt-1">{description}</p>}
        </div>
    );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
        <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5 block">
            {children}
            {required && <span className="text-flo-orange ml-0.5">*</span>}
        </label>
    );
}

function TextInput({
    value,
    onChange,
    placeholder,
    type = 'text',
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
}) {
    return (
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-flo-orange/40 transition-colors"
        />
    );
}

function SelectInput({
    value,
    onChange,
    options,
}: {
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-flo-orange/40 transition-colors cursor-pointer"
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#1a1a1a] text-white">
                        {opt.label}
                    </option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
        </div>
    );
}

function TextArea({
    value,
    onChange,
    placeholder,
    rows = 3,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    rows?: number;
}) {
    return (
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-flo-orange/40 transition-colors resize-none"
        />
    );
}

// ─── Main Form ───────────────────────────────────────────

interface ClientFormProps {
    mode: 'create' | 'edit';
    initialData?: ClientFull | null;
}

export default function ClientForm({ mode, initialData }: ClientFormProps) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ── Basics
    const [businessName, setBusinessName] = useState(initialData?.business_name || '');
    const [legalName, setLegalName] = useState(initialData?.legal_name || '');
    const [slug, setSlug] = useState(initialData?.slug || '');
    const [slugTouched, setSlugTouched] = useState(false);
    const [vertical, setVertical] = useState(initialData?.vertical || '');
    const [status, setStatus] = useState<ClientStatus>(initialData?.status || 'lead');
    const [clientPackage, setClientPackage] = useState<CreateClientPayload['package']>(initialData?.package);
    const [startDate, setStartDate] = useState(initialData?.start_date || '');
    const [notes, setNotes] = useState(initialData?.notes || '');
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.logo_url || null);

    // ── Contacts
    const [contacts, setContacts] = useState<ClientContact[]>(
        initialData?.contacts || [
            { type: 'decision_maker', name: '', role: '', email: '', phone: '' },
            { type: 'primary', name: '', role: '', email: '', phone: '' },
        ]
    );

    // ── Locations
    const [locations, setLocations] = useState<ClientLocation[]>(
        initialData?.locations || [
            { label: 'Main', address: '', city: '', google_maps_url: '', phone: '' },
        ]
    );

    // ── Offers
    const [offers, setOffers] = useState<ClientOffer[]>(
        initialData?.offers || [
            { name: '', is_primary: true },
        ]
    );

    // ── Links
    const [links, setLinks] = useState<ClientLink[]>(
        initialData?.links || []
    );

    // ─── Vertical Search State
    const [verticalSearch, setVerticalSearch] = useState('');
    const [isVerticalOpen, setIsVerticalOpen] = useState(false);

    const filteredIndustries = INDUSTRIES.filter((ind) =>
        ind.label.toLowerCase().includes(verticalSearch.toLowerCase())
    );

    // Auto-slug
    const handleBusinessNameChange = (val: string) => {
        setBusinessName(val);
        if (!slugTouched) {
            setSlug(slugify(val));
        }
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // ── Contact helpers
    const updateContact = (index: number, field: string, value: string) => {
        setContacts((prev) =>
            prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
        );
    };
    const addContact = () => {
        setContacts((prev) => [...prev, { type: 'secondary', name: '', role: '', email: '', phone: '' }]);
    };
    const removeContact = (index: number) => {
        setContacts((prev) => prev.filter((_, i) => i !== index));
    };

    // ── Location helpers
    const updateLocation = (index: number, field: string, value: string) => {
        setLocations((prev) =>
            prev.map((l, i) => (i === index ? { ...l, [field]: value } : l))
        );
    };
    const addLocation = () => {
        setLocations((prev) => [...prev, { label: '', address: '', city: '', google_maps_url: '', phone: '' }]);
    };
    const removeLocation = (index: number) => {
        setLocations((prev) => prev.filter((_, i) => i !== index));
    };

    // ── Offer helpers
    const updateOffer = (index: number, field: string, value: any) => {
        setOffers((prev) =>
            prev.map((o, i) => (i === index ? { ...o, [field]: value } : o))
        );
    };
    const setPrimaryOffer = (index: number) => {
        setOffers((prev) =>
            prev.map((o, i) => ({ ...o, is_primary: i === index }))
        );
    };
    const addOffer = () => {
        setOffers((prev) => [...prev, { name: '', is_primary: false }]);
    };
    const removeOffer = (index: number) => {
        setOffers((prev) => prev.filter((_, i) => i !== index));
    };

    // ── Link helpers
    const updateLink = (index: number, field: string, value: string) => {
        setLinks((prev) =>
            prev.map((l, i) => (i === index ? { ...l, [field]: value } : l))
        );
    };
    const addLink = () => {
        setLinks((prev) => [...prev, { type: 'website' as LinkType, label: '', url: '' }]);
    };
    const removeLink = (index: number) => {
        setLinks((prev) => prev.filter((_, i) => i !== index));
    };

    // ── Submit
    const handleSubmit = async () => {
        setError(null);

        // Basic validation
        if (!businessName.trim()) return setError('Business name is required.');
        if (!slug.trim()) return setError('Slug is required.');
        if (!vertical.trim()) return setError('Vertical is required.');
        if (contacts.filter((c) => c.name.trim()).length === 0)
            return setError('At least one contact with a name is required.');
        if (locations.filter((l) => l.address.trim() && l.city.trim()).length === 0)
            return setError('At least one location with address and city is required.');

        const payload: CreateClientPayload = {
            slug: slug.trim(),
            business_name: businessName.trim(),
            legal_name: legalName.trim() || undefined,
            vertical: vertical.trim(),
            package: clientPackage,
            status,
            start_date: startDate || null,
            notes: notes.trim() || undefined,
            contacts: contacts.filter((c) => c.name.trim()),
            locations: locations.filter((l) => l.address.trim()),
            offers: offers.filter((o) => o.name.trim()),
            links: links.filter((l) => l.url.trim()),
        };

        setSaving(true);
        try {
            let logoUrl = initialData?.logo_url;

            if (mode === 'create') {
                const newId = await createAdminClient({ ...payload, logo_url: null });

                if (logoFile) {
                    const { publicUrl } = await uploadFile(`clients/${newId}/logo`, logoFile);
                    await updateAdminClient(newId, { logo_url: publicUrl });
                }
                router.push(`/admin/clients/${newId}`);
            } else if (initialData) {
                if (logoFile) {
                    const { publicUrl } = await uploadFile(`clients/${initialData.id}/logo`, logoFile);
                    logoUrl = publicUrl;
                }
                await updateAdminClient(initialData.id, { ...payload, logo_url: logoUrl });
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message || 'Failed to save client.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="w-full space-y-10 pb-20">
            {/* Error */}
            {error && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                    {error}
                </div>
            )}

            {/* ═══ Basics ═══ */}
            <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 space-y-5">
                <SectionTitle title="Basics" description="Core client information" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    <div className="row-span-2">
                        <FieldLabel>Logo</FieldLabel>
                        <div className="mt-1.5 flex items-center gap-5">
                            <div className="relative w-24 h-24 rounded-full bg-white/[0.04] border border-white/[0.08] overflow-hidden flex items-center justify-center group shrink-0">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon className="w-8 h-8 text-white/20" />
                                )}
                                <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                                    <span className="text-xs font-medium text-white">Change</span>
                                    <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                                </label>
                            </div>
                            <div className="flex-1 space-y-2.5 pt-1">
                                <p className="text-xs text-white/40 font-medium tracking-wide">
                                    Recommended: 400x400px (PNG/JPG)
                                </p>
                                <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-white/70 hover:text-white transition-all border border-white/5 cursor-pointer group-hover:border-white/10">
                                    <span className="w-1.5 h-1.5 rounded-full bg-flo-orange/50 group-hover:bg-flo-orange transition-colors" />
                                    Select File
                                    <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <FieldLabel required>Business Name</FieldLabel>
                        <TextInput value={businessName} onChange={handleBusinessNameChange} placeholder="Acme Inc." />
                    </div>
                    <div>
                        <FieldLabel>Legal Name</FieldLabel>
                        <TextInput value={legalName} onChange={setLegalName} placeholder="Acme Incorporated LLC" />
                    </div>
                    <div>
                        <FieldLabel required>Slug</FieldLabel>
                        <TextInput
                            value={slug}
                            onChange={(v) => {
                                setSlugTouched(true);
                                setSlug(v);
                            }}
                            placeholder="acme-inc"
                        />
                    </div>
                    <div>
                        <FieldLabel required>Vertical</FieldLabel>
                        <div className="relative">
                            <div
                                className="relative w-full"
                                onClick={() => setIsVerticalOpen(!isVerticalOpen)}
                            >
                                <input
                                    type="text"
                                    value={vertical || verticalSearch}
                                    onChange={(e) => {
                                        setVertical(e.target.value);
                                        setVerticalSearch(e.target.value);
                                        setIsVerticalOpen(true);
                                    }}
                                    onFocus={() => setIsVerticalOpen(true)}
                                    // onBlur={() => setTimeout(() => setIsVerticalOpen(false), 200)}
                                    className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-flo-orange/40 transition-colors cursor-pointer"
                                    placeholder="Select or type..."
                                />
                                <ChevronsUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                            </div>

                            {isVerticalOpen && (
                                <div className="absolute z-50 w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-auto">
                                    {filteredIndustries.length > 0 ? (
                                        filteredIndustries.map((industry) => (
                                            <button
                                                key={industry.value}
                                                type="button"
                                                onClick={() => {
                                                    setVertical(industry.label);
                                                    setVerticalSearch('');
                                                    setIsVerticalOpen(false);
                                                }}
                                                className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors flex items-center justify-between"
                                            >
                                                <span>{industry.label}</span>
                                                {vertical === industry.label && <Check className="w-4 h-4 text-flo-orange" />}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-sm text-white/30 italic">No industries found.</div>
                                    )}
                                </div>
                            )}
                            {isVerticalOpen && (
                                <div
                                    className="fixed inset-0 z-40 bg-transparent"
                                    onClick={() => setIsVerticalOpen(false)}
                                />
                            )}
                        </div>
                    </div>
                    <div>
                        <FieldLabel required>Package</FieldLabel>
                        <div className="relative">
                            <select
                                value={clientPackage || ''}
                                onChange={(e) => setClientPackage(e.target.value as any)}
                                className="w-full appearance-none px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-flo-orange/40 transition-colors cursor-pointer"
                                required
                            >
                                <option value="" disabled className="bg-[#1a1a1a] text-white/50">Select Package</option>
                                <option value="FLO OS" className="bg-[#1a1a1a] text-white">FLO OS</option>
                                <option value="Funnel Builder" className="bg-[#1a1a1a] text-white">Funnel Builder</option>
                                <option value="Media Marketing" className="bg-[#1a1a1a] text-white">Media Marketing</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <FieldLabel required>Status</FieldLabel>
                        <SelectInput value={status} onChange={(v) => setStatus(v as ClientStatus)} options={STATUS_OPTIONS} />
                    </div>
                    <div>
                        <FieldLabel>Start Date</FieldLabel>
                        <TextInput type="date" value={startDate} onChange={setStartDate} />
                    </div>
                </div>
                <div>
                    <FieldLabel>Notes</FieldLabel>
                    <TextArea value={notes} onChange={setNotes} placeholder="Internal notes about this client..." />
                </div>
            </section>

            {/* ═══ Contacts ═══ */}
            <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 space-y-5">
                <SectionTitle title="Contacts" description="Require at least a decision maker and a primary contact" />
                {contacts.map((contact, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                        <div className="flex items-center justify-between">
                            <SelectInput
                                value={contact.type}
                                onChange={(v) => updateContact(i, 'type', v)}
                                options={CONTACT_TYPES}
                            />
                            {contacts.length > 1 && (
                                <button onClick={() => removeContact(i)} className="p-1.5 text-white/20 hover:text-red-400 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <FieldLabel required>Name</FieldLabel>
                                <TextInput value={contact.name} onChange={(v) => updateContact(i, 'name', v)} placeholder="Jane Doe" />
                            </div>
                            <div>
                                <FieldLabel>Role</FieldLabel>
                                <TextInput value={contact.role} onChange={(v) => updateContact(i, 'role', v)} placeholder="CEO" />
                            </div>
                            <div>
                                <FieldLabel>Email</FieldLabel>
                                <TextInput value={contact.email} onChange={(v) => updateContact(i, 'email', v)} placeholder="jane@acme.com" type="email" />
                            </div>
                            <div>
                                <FieldLabel>Phone</FieldLabel>
                                <TextInput value={contact.phone} onChange={(v) => updateContact(i, 'phone', v)} placeholder="+1 (555) 000-0000" />
                            </div>
                        </div>
                    </div>
                ))}
                <button onClick={addContact} className="flex items-center gap-2 text-sm text-white/40 hover:text-flo-orange transition-colors">
                    <Plus className="w-4 h-4" /> Add Contact
                </button>
            </section>

            {/* ═══ Locations ═══ */}
            <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 space-y-5">
                <SectionTitle title="Locations" description="At least one location is required" />
                {locations.map((loc, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 max-w-[200px]">
                                <FieldLabel>Label</FieldLabel>
                                <TextInput value={loc.label} onChange={(v) => updateLocation(i, 'label', v)} placeholder="Main" />
                            </div>
                            {locations.length > 1 && (
                                <button onClick={() => removeLocation(i)} className="p-1.5 text-white/20 hover:text-red-400 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <FieldLabel required>Address</FieldLabel>
                                <TextInput value={loc.address} onChange={(v) => updateLocation(i, 'address', v)} placeholder="123 Main St" />
                            </div>
                            <div>
                                <FieldLabel required>City</FieldLabel>
                                <TextInput value={loc.city} onChange={(v) => updateLocation(i, 'city', v)} placeholder="New York" />
                            </div>
                            <div>
                                <FieldLabel>Google Maps URL</FieldLabel>
                                <TextInput value={loc.google_maps_url} onChange={(v) => updateLocation(i, 'google_maps_url', v)} placeholder="https://maps.google.com/..." />
                            </div>
                            <div>
                                <FieldLabel>Phone</FieldLabel>
                                <TextInput value={loc.phone} onChange={(v) => updateLocation(i, 'phone', v)} placeholder="+1 (555) 000-0000" />
                            </div>
                        </div>
                    </div>
                ))}
                <button onClick={addLocation} className="flex items-center gap-2 text-sm text-white/40 hover:text-flo-orange transition-colors">
                    <Plus className="w-4 h-4" /> Add Location
                </button>
            </section>

            {/* ═══ Offers ═══ */}
            <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 space-y-5">
                <SectionTitle title="Offers" description="Mark one offer as the primary offer" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {offers.map((offer, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setPrimaryOffer(i)}
                                className={`p-2 rounded-lg border transition-all shrink-0 ${offer.is_primary
                                    ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                                    : 'text-white/15 border-white/[0.06] hover:text-amber-400/50'
                                    }`}
                                title={offer.is_primary ? 'Primary offer' : 'Set as primary'}
                            >
                                <Star className="w-4 h-4" fill={offer.is_primary ? 'currentColor' : 'none'} />
                            </button>
                            <div className="flex-1">
                                <TextInput value={offer.name} onChange={(v) => updateOffer(i, 'name', v)} placeholder="Offer name..." />
                            </div>
                            {offers.length > 1 && (
                                <button onClick={() => removeOffer(i)} className="p-1.5 text-white/20 hover:text-red-400 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <button onClick={addOffer} className="flex items-center gap-2 text-sm text-white/40 hover:text-flo-orange transition-colors">
                    <Plus className="w-4 h-4" /> Add Offer
                </button>
            </section>

            {/* ═══ Links ═══ */}
            <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 space-y-5">
                <SectionTitle title="Links" description="Website, socials, booking links, Google Business Profile" />
                {links.length === 0 && (
                    <p className="text-sm text-white/20 italic">No links added yet.</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {links.map((link, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className="w-48 shrink-0">
                                <SelectInput
                                    value={link.type}
                                    onChange={(v) => updateLink(i, 'type', v)}
                                    options={LINK_TYPES}
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <TextInput value={link.url} onChange={(v) => updateLink(i, 'url', v)} placeholder="https://..." />
                                <TextInput value={link.label} onChange={(v) => updateLink(i, 'label', v)} placeholder="Label (optional)" />
                            </div>
                            <button onClick={() => removeLink(i)} className="p-1.5 mt-2 text-white/20 hover:text-red-400 transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
                <button onClick={addLink} className="flex items-center gap-2 text-sm text-white/40 hover:text-flo-orange transition-colors">
                    <Plus className="w-4 h-4" /> Add Link
                </button>
            </section>

            {/* ═══ Submit ═══ */}
            <div className="flex items-center justify-end gap-4">
                <button
                    onClick={() => router.push('/admin/clients')}
                    className="px-5 py-3 text-sm font-medium text-white/40 hover:text-white transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex items-center gap-2.5 px-6 py-3 bg-flo-orange hover:bg-flo-orange-dark text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-flo-orange/20 hover:shadow-flo-orange/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            {mode === 'create' ? 'Create Client' : 'Save Changes'}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
