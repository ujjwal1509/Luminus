import { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';

export const Card = forwardRef(({ customClass, style, onClick, children, ...rest }, ref) => (
    <div
        ref={ref}
        onClick={onClick}
        style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.10)',
            background: 'rgba(8,6,20,0.85)',
            backdropFilter: 'blur(16px)',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            overflow: 'hidden',
            cursor: 'pointer',
            ...style,
        }}
        {...rest}
    >
        {children}
    </div>
));
Card.displayName = 'Card';

const makeSlot = (i, distX, distY, total) => ({
    x: i * distX,
    y: -i * distY,
    z: -i * distX * 1.5,
    zIndex: total - i,
});

const placeNow = (el, slot, skew) =>
    gsap.set(el, {
        x: slot.x, y: slot.y, z: slot.z,
        xPercent: -50, yPercent: -50,
        skewY: skew,
        transformOrigin: 'center center',
        zIndex: slot.zIndex,
        force3D: true,
    });

const CardSwap = ({
    width = 500,
    height = 400,
    cardDistance = 60,
    verticalDistance = 70,
    delay = 5000,
    pauseOnHover = true,
    onCardClick,
    skewAmount = 6,
    easing = 'elastic',
    children,
}) => {
    const config =
        easing === 'elastic'
            ? { ease: 'elastic.out(0.6,0.9)', durDrop: 2, durMove: 2, durReturn: 2, promoteOverlap: 0.9, returnDelay: 0.05 }
            : { ease: 'power1.inOut', durDrop: 0.8, durMove: 0.8, durReturn: 0.8, promoteOverlap: 0.45, returnDelay: 0.2 };

    const childArr = useMemo(() => Children.toArray(children), [children]);
    const refs = useMemo(() => childArr.map(() => ({ current: null })), [childArr.length]);
    const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
    const tlRef = useRef(null);
    const intervalRef = useRef();
    const container = useRef(null);

    useEffect(() => {
        const total = refs.length;
        refs.forEach((r, i) => {
            if (r.current) placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount);
        });

        const swap = () => {
            if (order.current.length < 2) return;
            const [front, ...rest] = order.current;
            const elFront = refs[front].current;
            if (!elFront) return;
            const tl = gsap.timeline();
            tlRef.current = tl;

            tl.to(elFront, { y: '+=500', duration: config.durDrop, ease: config.ease });
            tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);

            rest.forEach((idx, i) => {
                const el = refs[idx].current;
                const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
                tl.set(el, { zIndex: slot.zIndex }, 'promote');
                tl.to(el, { x: slot.x, y: slot.y, z: slot.z, duration: config.durMove, ease: config.ease }, `promote+=${i * 0.15}`);
            });

            const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
            tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
            tl.call(() => { gsap.set(elFront, { zIndex: backSlot.zIndex }); }, undefined, 'return');
            tl.to(elFront, { x: backSlot.x, y: backSlot.y, z: backSlot.z, duration: config.durReturn, ease: config.ease }, 'return');
            tl.call(() => { order.current = [...rest, front]; });
        };

        swap();
        intervalRef.current = window.setInterval(swap, delay);

        if (pauseOnHover && container.current) {
            const node = container.current;
            const pause = () => { tlRef.current?.pause(); clearInterval(intervalRef.current); };
            const resume = () => { tlRef.current?.play(); intervalRef.current = window.setInterval(swap, delay); };
            node.addEventListener('mouseenter', pause);
            node.addEventListener('mouseleave', resume);
            return () => {
                node.removeEventListener('mouseenter', pause);
                node.removeEventListener('mouseleave', resume);
                clearInterval(intervalRef.current);
            };
        }
        return () => clearInterval(intervalRef.current);
    }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing]);

    // Clicking a back card brings it to front
    const handleCardClick = (i) => {
        const pos = order.current.indexOf(i);
        if (pos === 0) {
            // Already front — let the navigate happen
            onCardClick?.(i);
            return;
        }
        // Rotate to bring this card to front
        const steps = pos;
        const [front, ...rest] = order.current;
        const newOrder = [...order.current.slice(pos), ...order.current.slice(0, pos)];
        order.current = newOrder;

        const total = refs.length;
        const tl = gsap.timeline();
        tlRef.current = tl;

        newOrder.forEach((idx, i) => {
            const el = refs[idx].current;
            const slot = makeSlot(i, cardDistance, verticalDistance, total);
            tl.set(el, { zIndex: slot.zIndex });
            tl.to(el, { x: slot.x, y: slot.y, z: slot.z, duration: 0.6, ease: 'power2.out' }, i * 0.05);
        });
    };

    const rendered = childArr.map((child, i) =>
        isValidElement(child)
            ? cloneElement(child, {
                key: i,
                ref: (el) => { refs[i].current = el; },
                style: { width, height, ...(child.props.style ?? {}) },
                onClick: (e) => {
                    child.props.onClick?.(e);
                    handleCardClick(i);
                },
            })
            : child
    );

    return (
        <div
            ref={container}
            style={{
                position: 'relative',
                width,
                height,
                perspective: 900,
            }}
        >
            {rendered}
        </div>
    );
};

export default CardSwap;