package geurime.database.entity;

import geurime.database.enums.BoxType;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@DynamicUpdate
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "drawing_box")
public class DrawingBox {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "drawing_box_id", nullable = false)
    private Long id;

    @Column(name = "drawing_box_name", nullable = false, length = 40)
    private String drawingBoxName;

    @Enumerated(EnumType.STRING)
    @Column(name = "drawing_box_category", nullable = false)
    private BoxType drawingBoxCategory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kid_id")
    private Kid kid;

    @OneToMany(mappedBy = "drawingBox", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Drawing> drawingList = new ArrayList<>();

    @Builder
    public DrawingBox(Long id, String drawingBoxName, BoxType drawingBoxCategory, Kid kid, List<Drawing> drawingList) {
        this.id = id;
        this.drawingBoxName = drawingBoxName;
        this.drawingBoxCategory = drawingBoxCategory;
        this.kid = kid;
        this.drawingList = drawingList;
    }
}