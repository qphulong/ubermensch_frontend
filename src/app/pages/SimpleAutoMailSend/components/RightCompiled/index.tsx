import React from 'react';
import styles from './RightCompiled.module.css';

interface Student {
    student_name: string;
    email: string;
    marks: { [key: string]: number };
}

interface EmailRequest {
    gmail: string;
    app_password: string;
    template: string;
    template_vars: { [key: string]: string };
    subject: string;
    scores: Student[];
}

interface RightCompiledProps {
    parsedData: EmailRequest | null;
}

const RightCompiled: React.FC<RightCompiledProps> = ({ parsedData }) => {
    const renderEmailPreview = (student: Student, template: string, templateVars: { [key: string]: string }) => {
        const marksTable = Object.entries(student.marks)
            .map(([subj, val]) => `${subj}: ${val}`)
            .join('\n');
        return template
            .replace('{student_name}', student.student_name)
            .replace('{marks_table}', marksTable)
            .replace(/{([^{}]+)}/g, (_, key) => templateVars[key] || `{${key}}`);
    };

    return (
        <div className={styles.rightPanel}>
            <h2>Email Previews</h2>
            {parsedData && parsedData.scores ? (
                parsedData.scores.map((student, index) => (
                    <div key={index} className={styles.emailPreview}>
                        <h3>To: {student.email}</h3>
                        <p>Subject: {parsedData.subject}</p>
                        <pre>{renderEmailPreview(student, parsedData.template, parsedData.template_vars)}</pre>
                    </div>
                ))
            ) : (
                <p className={styles.noDataMessage}>No valid JSON data to preview</p>
            )}
        </div>
    );
};

export default RightCompiled;