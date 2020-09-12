import React from 'react';
import { connect } from 'react-redux'
import '../../css/app.scss';
import UserDetail from './user_detail/user_detail';
import { fetchListData } from '../actions/data';
import Header from './common/header';
import Footer from './common/footer';


class User extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <Header />
                <UserDetail />
                <Footer />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    data: state.data,
    hasError: state.getDataError,
    isLoading: state.loadData
});

const mapDispatchToProps= dispatch => ({
    fetchData: (url) => dispatch(fetchListData(url))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(User)
