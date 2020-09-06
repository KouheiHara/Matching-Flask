import React from 'react';
import { Typography } from 'antd'; 
import { XS_SIZE, MD_SIZE } from './config';
const { Title } = Typography;

export function moveToPageAndJumpAnchor(path, anchor) {
    window.location.href = `${path}${anchor}`;
}

export function CustomTitle(keys) {
    if (keys["window_size"] < XS_SIZE) {
        return <Title level={4} {...keys}>{keys["text"]}</Title>
    } else if (keys["window_size"] < MD_SIZE) {
        return <Title level={3} {...keys}>{keys["text"]}</Title>
    } else {
        return <Title level={2} {...keys}>{keys["text"]}</Title>
    }
}

export function CustomChar(keys) {
    if (keys["window_size"] < XS_SIZE) {
        return <p style={{fontSize:18}} {...keys}>{keys["text"]}</p>
    } else if (keys["window_size"] < MD_SIZE) {
        return <p style={{fontSize:22}} {...keys}>{keys["text"]}</p>
    } else {
        return <p style={{fontSize:25}} {...keys}>{keys["text"]}</p>
    }
}