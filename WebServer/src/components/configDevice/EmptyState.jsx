import { Database } from "lucide-react";

const EmptyState = ({ 
    icon: Icon = Database,
    title = "No hay registros Modbus configurados",
    subtitle = "Haz clic en \"Agregar\" para comenzar",
    iconSize = "w-8 h-8",
    className = ""
}) => {
    return (
        <div className={`text-center py-6 text-zinc-500 ${className}`}>
            <Icon className={`${iconSize} text-zinc-600 mx-auto mb-2`} />
            <p className="text-sm">{title}</p>
            {subtitle && (
                <p className="text-xs text-zinc-600 mt-1">{subtitle}</p>
            )}
        </div>
    );
};

export default EmptyState;