import LeadsTable from "@/components/leads/LeadsTable";

export default function LeadsPage() {
    return (
        <div className="space-y-4 ">
            <h1 className="text-5xl  font-semibold tracking-tight bg-gradient-to-t from-blue-600 to-black dark:to-white bg-clip-text text-transparent  drop-shadow-lg">Leads</h1>
            <LeadsTable />
        </div>
    );
}


