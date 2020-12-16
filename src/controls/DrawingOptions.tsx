import { ControlProps } from "./Controls";


export default function DrawingOptions({ values, setValues }: ControlProps) {
    const com = values.showCenterOfMass;
    const vision = values.showVision;
    const group = values.showGroup;
    return (
        <div className="DrawingOptions">
            <div>
                <input
                    type="checkbox"
                    checked={com}
                    onClick={() => setValues({ ...values, showCenterOfMass: !com })}
                />
                &nbsp;show center of mass
            </div>
            <div>
                <input
                    type="checkbox"
                    checked={vision}
                    onClick={() => setValues({ ...values, showVision: !vision })}
                    />
                &nbsp;show vision of boids
            </div>
            <div>
                <input
                    type="checkbox"
                    checked={group}
                    onClick={() => setValues({ ...values, showGroup: !group })}
                    />
                &nbsp;show groups
            </div>
        </div>
    );
}