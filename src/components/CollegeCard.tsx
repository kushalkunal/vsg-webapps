import { Link } from "@tanstack/react-router";
import { MapPin, Award, Building2, Star, CheckCircle2, Home, ArrowRight } from "lucide-react";
import type { College } from "@/services/collegeService";

export function CollegeCard({ college }: { college: College }) {
  const location = [college.city, college.state, college.country].filter(Boolean).join(", ");

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft hover:shadow-elegant transition-all duration-300 hover:-translate-y-0.5">
      {/* Image / placeholder */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
        {college.imageUrl ? (
          <img
            src={college.imageUrl}
            alt={college.name}
            loading="lazy"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Building2 className="h-14 w-14 text-primary/20" />
          </div>
        )}
        {college.ranking && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-background/95 backdrop-blur px-2.5 py-1 text-xs font-semibold text-foreground shadow-soft">
            <Star className="h-3.5 w-3.5 text-warning" /> Rank #{college.ranking}
          </div>
        )}
        {/* Approval badges */}
        <div className="absolute top-3 right-3 flex gap-1">
          {college.nmcApproved && (
            <span className="rounded-full bg-success/90 text-white px-2 py-0.5 text-[10px] font-bold">NMC</span>
          )}
          {college.whoApproved && (
            <span className="rounded-full bg-primary/90 text-white px-2 py-0.5 text-[10px] font-bold">WHO</span>
          )}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-2">
        <Link to="/colleges/$id" params={{ id: college.id }}>
          <h3 className="font-display font-bold text-base text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {college.name}
          </h3>
        </Link>

        {location && (
          <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" /> {location}
          </p>
        )}

        {college.affiliation && (
          <p className="inline-flex items-center gap-1 text-xs text-secondary font-medium">
            <Award className="h-3.5 w-3.5 shrink-0" /> {college.affiliation}
          </p>
        )}

        {college.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{college.description}</p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <div className="flex gap-2">
            {college.hostelAvailable && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground border border-border rounded-full px-2 py-0.5">
                <Home className="h-3 w-3" /> Hostel
              </span>
            )}
            {(college.nmcApproved || college.whoApproved) && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-success border border-success/30 rounded-full px-2 py-0.5">
                <CheckCircle2 className="h-3 w-3" /> Approved
              </span>
            )}
          </div>
          <Link
            to="/colleges/$id"
            params={{ id: college.id }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:gap-2 transition-all"
          >
            View Details <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
