import * as React from "react";
import Loadable from "react-loadable";
import Loading from "../../../common/components/layout/Loading";

const LoadableComponent = Loadable({
  loader: () => import(/* webpackChunkName: "articleProducts" */ "./ArticleProducts"),
  loading: Loading
});

export default class LoadableScripts extends React.Component {
  render() {
    return <LoadableComponent {...this.props} />;
  }
}
