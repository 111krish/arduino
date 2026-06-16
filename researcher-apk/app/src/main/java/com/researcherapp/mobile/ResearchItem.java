package com.researcherapp.mobile;

public class ResearchItem {
    public final String id;
    public final String title;
    public final String status;
    public final String category;
    public final String description;
    public final int    progress;
    public final String updatedAt;

    public ResearchItem(String id, String title, String status, String category,
                        String description, int progress, String updatedAt) {
        this.id          = id;
        this.title       = title;
        this.status      = status;
        this.category    = category;
        this.description = description;
        this.progress    = progress;
        this.updatedAt   = updatedAt;
    }

    public static ResearchItem[] mockData() {
        return new ResearchItem[]{
            new ResearchItem("1", "Climate Change Impact on Coral Reefs",
                "active", "Environmental",
                "Studying bleaching patterns across Pacific reefs.", 72, "2026-06-10"),
            new ResearchItem("2", "Machine Learning in Drug Discovery",
                "active", "Biomedical",
                "Applying transformer models to protein folding predictions.", 45, "2026-06-14"),
            new ResearchItem("3", "Quantum Error Correction Protocols",
                "completed", "Physics",
                "Surface code implementations on 50-qubit systems.", 100, "2026-03-20"),
            new ResearchItem("4", "Microbiome and Mental Health",
                "pending", "Neuroscience",
                "Gut-brain axis correlation studies in anxiety patients.", 8, "2026-06-12"),
            new ResearchItem("5", "Renewable Energy Grid Stability",
                "active", "Engineering",
                "Frequency regulation in high-penetration solar grids.", 61, "2026-06-15"),
            new ResearchItem("6", "Ancient DNA Sequencing Techniques",
                "archived", "Archaeology",
                "Extracting and analyzing 10,000-year-old samples.", 100, "2025-12-30"),
        };
    }
}
