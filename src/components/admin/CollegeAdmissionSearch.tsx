import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Loader2, GraduationCap, MapPin, Star, Building2 } from "lucide-react";
import { useAdmissionSearch } from "@/hooks/useAdmissionSearch";
import { courseService } from "@/services/courseService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CollegeWithFees, FeeSummary } from "@/services/collegeService";

const COUNTRIES = [
  "India", "Russia", "Ukraine", "Kazakhstan", "Philippines",
  "China", "Kyrgyzstan", "Georgia", "Egypt", "Bangladesh",
];

function fmt(n: number, currency = "INR") {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `${currency} ${n.toLocaleString()}`;
  }
}

function FeeBreakdownTable({ fees }: { fees: FeeSummary[] }) {
  if (!fees.length) {
    return <p className="text-sm text-muted-foreground italic">No fee data available.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Branch</TableHead>
          <TableHead className="text-right">Registration</TableHead>
          <TableHead className="text-right">Tuition (Yearly)</TableHead>
          <TableHead className="text-right">Examination</TableHead>
          <TableHead className="text-right">Hostel</TableHead>
          <TableHead className="text-right">Pkg w/o Hostel</TableHead>
          <TableHead className="text-right">Pkg w/ Hostel</TableHead>
          <TableHead className="text-right">Misc</TableHead>
          <TableHead className="text-right font-bold">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fees.map((f) => (
          <TableRow key={f.id}>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium">{f.branch ?? "—"}</span>
                {f.courseName && (
                  <span className="text-xs text-muted-foreground">{f.courseName}</span>
                )}
              </div>
            </TableCell>
            <TableCell className="text-right">{fmt(f.registrationFee, f.currency)}</TableCell>
            <TableCell className="text-right">{fmt(f.tuitionFee, f.currency)}</TableCell>
            <TableCell className="text-right">{fmt(f.examinationFee, f.currency)}</TableCell>
            <TableCell className="text-right">{fmt(f.hostelFee, f.currency)}</TableCell>
            <TableCell className="text-right">{fmt(f.totalPkgWithoutHostel, f.currency)}</TableCell>
            <TableCell className="text-right">{fmt(f.totalPkgWithHostel, f.currency)}</TableCell>
            <TableCell className="text-right">{fmt(f.miscellaneousFee, f.currency)}</TableCell>
            <TableCell className="text-right font-bold text-primary">
              {fmt(f.totalFee, f.currency)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function CollegeResultCard({ college }: { college: CollegeWithFees }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            {college.imageUrl ? (
              <img
                src={college.imageUrl}
                alt={college.name}
                className="h-12 w-12 rounded-lg object-cover flex-shrink-0 border border-border"
              />
            ) : (
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
            )}
            <div className="min-w-0">
              <CardTitle className="text-base leading-tight">{college.name}</CardTitle>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {[college.city, college.state, college.country].filter(Boolean).join(", ")}
                </span>
                {college.ranking && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3" /> Rank #{college.ranking}
                  </span>
                )}
              </div>
              {college.affiliation && (
                <p className="text-xs text-muted-foreground mt-0.5">{college.affiliation}</p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-1 flex-shrink-0">
            {college.nmcApproved && <Badge variant="secondary" className="text-[10px]">NMC</Badge>}
            {college.whoApproved && <Badge variant="secondary" className="text-[10px]">WHO</Badge>}
            {college.hostelAvailable && <Badge variant="outline" className="text-[10px]">Hostel</Badge>}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {college.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{college.description}</p>
        )}

        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <GraduationCap className="h-3.5 w-3.5" />
            Fee Breakdown ({college.fees.length} {college.fees.length === 1 ? "branch" : "branches"})
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={() => setExpanded((p) => !p)}
          >
            {expanded ? "Hide" : "Show"}
          </Button>
        </div>

        {expanded && (
          <div className="rounded-md border border-border overflow-x-auto">
            <FeeBreakdownTable fees={college.fees} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function CollegeAdmissionSearch() {
  const [course, setCourse] = useState("");
  const [branch, setBranch] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("all");
  const [submitted, setSubmitted] = useState(false);

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: courseService.list,
  });

  const searchParams = submitted
    ? {
        course: course || undefined,
        branch: branch.trim() || undefined,
        city: city.trim() || undefined,
        country: country !== "all" ? country : undefined,
      }
    : {};

  const { data: results = [], isLoading, isFetching } = useAdmissionSearch(
    submitted ? searchParams : {}
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setCourse("");
    setBranch("");
    setCity("");
    setCountry("all");
    setSubmitted(false);
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="rounded-xl border border-border bg-muted/30 p-5">
        <h3 className="text-sm font-semibold mb-4 text-foreground">
          Find Colleges by Course &amp; Branch
        </h3>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Course */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Course *</Label>
              <Select
                value={course}
                onValueChange={(v) => {
                  setCourse(v);
                  setBranch("");
                }}
                disabled={coursesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={coursesLoading ? "Loading…" : "Select course"} />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Branch */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Branch</Label>
              <Input
                placeholder="e.g. MBBS General"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              />
            </div>

            {/* Country */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Country</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="All countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">City</Label>
              <Input
                placeholder="e.g. Greater Noida"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={!course || isLoading}>
              {isLoading || isFetching ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Search Colleges
            </Button>
            {submitted && (
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Results */}
      {submitted && (
        <div className="space-y-4">
          {isLoading || isFetching ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-8 justify-center">
              <Loader2 className="h-5 w-5 animate-spin" />
              Searching colleges…
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No colleges found</p>
              <p className="text-sm mt-1">
                Try adjusting your filters or add fee structures for this course/branch combination.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  {results.length} college{results.length !== 1 ? "s" : ""} found
                  {course && ` for ${course}`}
                  {branch.trim() && ` — ${branch}`}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {results.map((college) => (
                  <CollegeResultCard key={college.id} college={college} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
