import React, {useState, useEffect, useCallback, useRef} from 'react';

import styles from '../styles/Slider.module.scss';

interface Props {
    min: number,
    max: number,
    setPrice?: (arg0: [number, number]) => void;  
};

type RefInput = React.MutableRefObject<HTMLInputElement>

const Slider: React.FC<Props> = ({ min, max, setPrice }) => {
    const [leftPointActive, setLeftPoint] = useState<boolean>(false);
    const [minValue, setMinValue] = useState<number>(min);
    const [maxValue, setMaxValue] = useState<number>(max);

    const minValRef: RefInput | null = useRef(null);
    const maxValRef: RefInput | null = useRef(null);
    const rangeRef: React.MutableRefObject<HTMLDivElement> | null = useRef(null);

    const getPercent = useCallback(
        (value: number) => Math.round(((value - min) / (max - min)) * 100),
        [min, max]
    );

    const changeMinHandler = (target) => {
        const value = Math.min(+target.value, maxValue - 1);
        setMinValue(value);
        target.value.toString();
    }

    const changeMaxHandler = (target) => {
        const value = Math.max(+target.value, minValue + 1);
        setMaxValue(value);
        target.value.toString();
    };

    useEffect(() => {
        setPrice([minValue, maxValue]);
    }, [minValue, maxValue]);

    useEffect(() => {
        if (maxValRef.current) {
            const minPercent = getPercent(minValue);
            const maxPercent = getPercent(+maxValRef.current.value);

            if (rangeRef.current) {
                rangeRef.current.style.left = `${minPercent}%`;
                rangeRef.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [minValue, getPercent]);

    useEffect(() => {
        if (minValRef.current) {
          const minPercent = getPercent(+minValRef.current.value);
          const maxPercent = getPercent(maxValue);
      
          if (rangeRef.current) {
           rangeRef.current.style.width = `${maxPercent - minPercent}%`;
          }
        }
      }, [maxValue, getPercent]);

    return (
        <div className={styles.container}>
            <div className={styles.row}>
                <input
                    className={`${styles.sliderValue} ${styles.left}`}
                    value={minValue}
                    onChange={({ target }) => changeMinHandler(target)}
                />
                <input 
                    className={`${styles.sliderValue} ${styles.right}`}
                    value={maxValue}
                    onChange={({ target }) => changeMaxHandler(target)}
                />
            </div>
            <div className={styles.sliderWrapper}>
                <input
                    ref={minValRef}
                    type="range"
                    min={min}
                    max={max}
                    step={1}
                    className={`${styles.point} ${leftPointActive ? styles.zFive : styles.zThree}`}
                    value={minValue}
                    onChange={({ target }) => changeMinHandler(target)}
                    onClick={() => setLeftPoint(true)}
                />
                <input
                    ref={maxValRef}
                    type="range"
                    min={min}
                    max={max}
                    step={1}
                    className={`${styles.point} ${styles.zFour}`}
                    value={maxValue}
                    onChange={({ target }) => changeMaxHandler(target)}
                    onClick={() => setLeftPoint(false)}
                />
                <div className={styles.slider}>
                    <div className={styles.track} />
                    <div className={styles.range} ref={rangeRef}/>
                </div>
            </div>
        </div>
    );
};

export default Slider;
