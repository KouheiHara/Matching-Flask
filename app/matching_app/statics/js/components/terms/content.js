import React from 'react';
import '../../../css/app.scss';
import {
    Row,
    Col,
    Card,
} from 'antd';
import { connect } from 'react-redux'


class TermsContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            card_width: 600,
            max_card_width: 900,
            small_width: 600,
            padding_width: 30,
            fontsize: 25,
            subtitle_fontsize: 35,
            title_fontsize: 50,
            small_fontsize: 15,
            big_fontsize: 25,
            subbig_fontsize: 35,
            titlebig_fontsize: 50,
        }
        this.updateDimensions = this.updateDimensions.bind(this)
    }
    updateDimensions() {
        this.setState({ width: window.innerWidth });
        if (this.state.width > (this.state.max_card_width + this.state.padding_width * 2)) {
            this.setState({
                card_width: this.state.max_card_width,
                fontsize: this.state.big_fontsize,
                subtitle_fontsize: this.state.subbig_fontsize,
                title_fontsize: this.state.titlebig_fontsize
            })
        } else {
            let fontSize = this.state.big_fontsize
            let subfontSize = this.state.subbig_fontsize
            let titlefontSize = this.state.titlebig_fontsize
            if (this.state.width < this.state.small_width) {
                fontSize = this.state.small_fontsize
                subfontSize = this.state.big_fontsize
                titlefontSize = this.state.subbig_fontsize
            }
            this.setState({
                card_width: this.state.width - this.state.padding_width * 2,
                fontsize: fontSize,
                subtitle_fontsize: subfontSize,
                title_fontsize: titlefontSize
            })
        }
    }
    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
        this.updateDimensions()
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }
    render() {
        return (
            <Col span={24} className="form-col">
                <div className="terms-card">
                    <Card
                        title={<p style={{ fontSize: this.state.title_fontsize }}>利用規約</p>}
                        bordered={false}
                        hoverable={true}
                        style={{
                            width: this.state.card_width,
                            fontSize: this.state.fontsize
                        }}>
                        <p>この利用規約（以下，「本規約」といいます。）は，データ分析サイト（以下，「当サイト」といいます。）がこのウェブサイト上で提供するサービス（以下，「本サービス」といいます。）の利用条件を定めるものです。ユーザーの皆さま（以下，「ユーザー」といいます。）には，本規約に従って，本サービスをご利用いただきます。</p>
                        <p style={{ fontSize: this.state.subtitle_fontsize }}>第1条（適用）</p>
                        <p>1.本規約は，ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されるものとします。</p>
                        <p>2.当社は本サービスに関し，本規約のほか，ご利用にあたってのルール等，各種の定め（以下，「個別規定」といいます。）をすることがあります。これら個別規定はその名称のいかんに関わらず，本規約の一部を構成するものとします。</p>
                        <p>3.本規約の規定が前条の個別規定の規定と矛盾する場合には，個別規定において特段の定めなき限り，個別規定の規定が優先されるものとします。</p>
                        <p style={{ fontSize: this.state.subtitle_fontsize }}>第2条（禁止事項）</p>
                        <p>ユーザーは，本サービスの利用にあたり，以下の行為をしてはなりません。</p>
                        <p>1.法令または公序良俗に違反する行為</p>
                        <p>2.犯罪行為に関連する行為</p>
                        <p>3.本サービスの内容等，本サービスに含まれる著作権，商標権ほか知的財産権を侵害する行為</p>
                        <p>4.当サイト，ほかのユーザー，またはその他第三者のサーバーまたはネットワークの機能を破壊したり，妨害したりする行為</p>
                        <p>5.本サービスによって得られた情報を商業的に利用する行為</p>
                        <p>6.当社のサービスの運営を妨害するおそれのある行為</p>
                        <p>7.不正アクセスをし，またはこれを試みる行為</p>
                        <p>8.他のユーザーに関する個人情報等を収集または蓄積する行為</p>
                        <p>9.不正な目的を持って本サービスを利用する行為</p>
                        <p>10.本サービスの他のユーザーまたはその他の第三者に不利益，損害，不快感を与える行為</p>
                        <p>11.当サイトが許諾しない本サービス上での宣伝，広告，勧誘，または営業行為</p>
                        <p>12.当サイトのサービスに関連して，反社会的勢力に対して直接または間接に利益を供与する行為</p>
                        <p>13.その他，当サイトが不適切と判断する行為</p>
                        <p style={{ fontSize: this.state.subtitle_fontsize }}>第3条（利用規約の変更）</p>
                        <p>当サイトは，必要と判断した場合には，ユーザーに通知することなくいつでも本規約を変更することができるものとします。なお，本規約の変更後，本サービスの利用を開始した場合には，当該ユーザーは変更後の規約に同意したものとみなします。</p>
                        <p style={{ fontSize: this.state.subtitle_fontsize }}>第4条（個人情報の取扱い）</p>
                        <p>当サイトは，本サービスの利用によって取得する個人情報については，当社「プライバシーポリシー」に従い適切に取り扱うものとします。</p>
                        <p style={{ fontSize: this.state.subtitle_fontsize }}>第5条（権利義務の譲渡の禁止）</p>
                        <p>ユーザーは，当サイトの書面による事前の承諾なく，利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し，または担保に供することはできません。</p>
                        <p style={{ fontSize: this.state.subtitle_fontsize }}>第6条（準拠法・裁判管轄）</p>
                        <p>1.本規約の解釈にあたっては，日本法を準拠法とします。</p>
                        <p>2.本サービスに関して紛争が生じた場合には，当サイトの所在地を管轄する裁判所を専属的合意管轄とします。</p>
                    </Card>
                </div>
            </Col>
        );
    }
}


const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TermsContent)

