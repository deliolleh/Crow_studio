package com.ssafy.crowstudio.piece.Entity;

import lombok.Data;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

@Entity
@DynamicUpdate
@Table(name="collectTb")
@Data
public class CollectEntity {

    //pk
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long collectSeq;

    @ManyToOne
    @JoinColumn(name="collectorSeq", referencedColumnName = "userSeq")
    private UserEntity collector;


    @ManyToOne
    @JoinColumn(name="collectingSeq", referencedColumnName = "pieceSeq")
    private PieceEntity collecting;

}
