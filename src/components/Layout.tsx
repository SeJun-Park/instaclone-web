import styled from "styled-components";

const Content = styled.main`
    margin: 0 auto;
    margin-top: 45px;
    max-width: 930px;
    width: 100%;
`

interface LayoutProps {
    children: React.ReactNode;
  }

export default function Layout({ children }:LayoutProps) {
    return (
        <Content>
            {children}
        </Content>
    )
}