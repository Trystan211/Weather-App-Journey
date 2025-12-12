export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-white/30 bg-white/10 text-blue-500 shadow-sm focus:ring-blue-500 ' +
                className
            }
        />
    );
}
