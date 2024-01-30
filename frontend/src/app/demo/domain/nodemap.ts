export interface NodeImage {
    url: string;
    height: number;
    width: number;
}

export interface NodeStyle {
    fontSize: string;
    color: string;
    background: string;
}

export interface NodeMap {
    topic: string;
    id: string;
    style: NodeStyle;
    expanded: boolean;
    parent: NodeMap;
    tags: string[];
    icons: string[];
    hyperLink: string;
    image: NodeImage;
    children: NodeMap[]; 
}