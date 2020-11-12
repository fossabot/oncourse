import * as React from "react";
import Loadable from "react-loadable";
import Loading from "../../../common/components/layout/Loading";

const LoadableComponent = Loadable({
  loader: () => import(/* webpackChunkName: "messages" */ "./Messages"),
  loading: Loading
});

export default class LoadableMessages extends React.Component {
  render() {
    return <LoadableComponent {...this.props} />;
  }
}
