import React from "react";
import styles from './ContactsForm.module.scss';


export type Contacts = {
    email: string;
    phone: string;
};

export type ContactsFormProps = {
    value: Contacts;
    onChange: (value: Contacts) => void;
};

export function ContactsForm({ value, onChange }: ContactsFormProps) {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onChange(value);
    }

    return (
        <form className={styles.form} name="order" onSubmit={handleSubmit}>
            <label className={styles.label}>
                <input
                    value={value.email}
                    onChange={(event) => onChange({ ...value, email: event.target.value })}
                    className={styles.input}
                    name="email"
                    type="email"
                    placeholder="Email"
                />
            </label>
            <label className={styles.label}>
                <input
                    value={value.phone}
                    onChange={(event) => onChange({ ...value, phone: event.target.value })}
                    className={styles.input}
                    name="phone"
                    type="tel"
                    placeholder="Phone"
                    pattern="^[0-9\+\-\(\)\s]{10,25}$"
                    data-validation-message="Enter a phone number, e.g. +1 000 000 0000."
                />
            </label>
        </form>
    );
}